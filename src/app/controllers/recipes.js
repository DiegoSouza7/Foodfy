const Receita = require('../models/recipes')
const Chef = require('../models/chefs')
const CascateFiles = require('../services/cascateFiles')
const File = require('../models/File')
const GetImage = require('../services/getImage')

module.exports = {
    async index(req, res) {
        try {
            let { page, limit } = req.query

            page = page || 1
            limit = limit || 6
            let offset = limit * (page - 1)
                orderby = 'recipes.created_at DESC'

            const params = {
                orderby,
                limit,
                offset
            }
                       
            let receitas = await Receita.paginate(params)

            const receitasPromise = receitas.map(async recipe => {
                recipe.file = await GetImage.getImage(recipe.id)
                return recipe
            })

            receitas = await Promise.all(receitasPromise)

            return res.render('client/index', {receitas})

        }catch(err) {
            console.error(err)
        }
    },
    async receitas(req, res) {
        try {
            let { page, limit, filter } = req.query            
            
            page = page || 1
            limit = limit || 14
            
            let offset = limit * (page - 1)
                orderby = 'recipes.created_at DESC'

            const params = {
                filter,
                orderby,
                limit,
                offset
            }
                       
            let receitas = await Receita.paginate(params)

            const receitasPromise = receitas.map(async recipe => {
                recipe.file = await GetImage.getImage(recipe.id)
                return recipe
            })

            receitas = await Promise.all(receitasPromise)
            
            if (receitas.length == 0) {
                return res.render('client/receitas', { filter })
            } else {
                const pagination = {
                    total: Math.ceil(receitas[0].total / limit),
                    page
                }

                return res.render('client/receitas', {receitas, pagination, filter})
            }

        }catch(err) {
            console.error(err)
        }
    },
    sobre(req, res) {
        try {
            return res.render('client/sobre')
        }catch(err) {
            console.error(err)
        }
    },
    async receita(req, res) {
        try {          
            let receita = await Receita.findOne({where: {id: req.params.id}})

            const autor = await Chef.findOne({where: {id: receita.chef_id}}, 'chefs.name')
            receita.autor = autor.name
            
            if(!receita) return res.send('receita not found!')
                        
            receita.file = await GetImage.getImages(receita.id)

            return res.render('client/receita', {receita})
        
        }catch(err) {
            console.error(err)
        }
    },
    async chefs(req, res) {
        try {
            let params = {},
                { page, limit } = req.query
    
            page = page || 1
            limit = limit || 10
            let offset = limit * (page - 1)
    
            params = {
                limit,
                offset
            }

            let chefs = await Chef.paginate(params)
            
            chefs = chefs.map(chef => ({
                ...chef,
                path: `${chef.path.replace('public', '')}`
            }))

    
            if(chefs.length == 0) {
                return res.render('client/chefs')
            } else{
                const pagination = {
                    total: Math.ceil(chefs[0].totalchefs / limit),
                    page
                }

                return res.render('client/chefs', {chefs, pagination})
            }
        }catch(err) {
            console.error(err)
        }
    },
    async chefsShow(req, res) {
        try {

            let chef = await Chef.findOne({where: {id: req.params.id}})

            if(!chef) return res.send('chef not found!')

            const totalRecipes = await Receita.findAll({where: {chef_id: req.params.id}})

            const total = totalRecipes.length

            const imageChef = await File.findOne({where: {id: chef.file_id}})

            chef = {
                ...chef,
                total: total,
                path: imageChef.path.replace('public', '')
            }
            
            let receitas = await Receita.findAll({where: {chef_id: req.params.id}})
            
            const receitasPromise = receitas.map(async recipe => {
                recipe.file = await GetImage.getImage(recipe.id)
                recipe.autor = chef.name
                return recipe
            })
            
            receitas = await Promise.all(receitasPromise)
            
            return res.render('client/chefShow', {chef, receitas})

        }catch(err) {
            console.error(err)
        }
    }
}