const Receita = require('../models/recipes')
const Chef = require('../models/chefs')
const {date} = require('../../lib/utils')
const File = require('../models/File')

module.exports = {
    async index(req, res) {
        try {
            let results,
                params = {},
                { page, limit } = req.query
    
            page = page || 1
            limit = limit || 6
            let offset = limit * (page - 1)
    
            params = {
                limit,
                offset
            }

            results = await Receita.paginate(params)
            let receitas = results.rows

            async function getImage(recipeId) {
                let results = await File.recipeFile(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)
                return files[0]
            }
            
            const receitasPromise = receitas.map(async recipe => {
                recipe.file = await getImage(recipe.id)
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
            let results,
                params = {},
                { page, limit, filter } = req.query            
            
            page = page || 1
            limit = limit || 14
            let offset = limit * (page - 1)
            
            params = {
                filter,
                limit,
                offset
            }
            
            results = await Receita.paginate(params)
            let receitas = results.rows

            async function getImage(recipeId) {
                let results = await File.recipeFile(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)
                return files[0]
            }
            
            const receitasPromise = receitas.map(async recipe => {
                recipe.file = await getImage(recipe.id)
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
            let results = await Receita.find(req.params.id)
            let receita = results.rows[0]

            if(!receita) return res.send('receita not found!')

            async function getImage(recipeId) {
                let results = await File.recipeFile(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)
                return files
            }

            receita.file = await getImage(receita.id)
                        
            receita.created_at = date(receita.created_at).format

            return res.render('client/receita', {receita})
        
        }catch(err) {
            console.error(err)
        }
    },
    async chefs(req, res) {
        try {
            let results,
                params = {},
                { filter, page, limit } = req.query
    
            page = page || 1
            limit = limit || 14
            let offset = limit * (page - 1)
    
            params = {
                filter,
                limit,
                offset
            }

            results = await Chef.paginate(params)
            chefs = results.rows.map(chef => ({
                ...chef,
                path: `${req.protocol}://${req.headers.host}${chef.path.replace('public', '')}`
            }))

    
            if(chefs.length == 0) {
                return res.render('client/chefs')
            } else{
                const pagination = {
                    total: Math.ceil(chefs[0].total / limit),
                    page
                }

                return res.render('client/chefs', {chefs, pagination, filter})
            }
        }catch(err) {
            console.error(err)
        }
    },
    async chefsShow(req, res) {
        try {
            const resultsChef = await Chef.find(req.params.id)
            let chef = resultsChef.rows[0]

            if(!chef) return res.send('chef not found!')

            chef = {
                ...chef,
                path: `${req.protocol}://${req.headers.host}${chef.path.replace('public', '')}`
            }

            const resultsReceitas = await Chef.findReceitasChef(req.params.id)
            let receitas = resultsReceitas.rows

            async function getImage(recipeId) {
                let results = await File.recipeFile(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)
                return files[0]
            }
            
            const receitasPromise = receitas.map(async recipe => {
                recipe.file = await getImage(recipe.id)
                return recipe
            })

            receitas = await Promise.all(receitasPromise)
            
            chef.updated_at = date(chef.updated_at).format
            return res.render('client/chefShow', {chef, receitas})

        }catch(err) {
            console.error(err)
        }
    }
}