const Chef = require('../models/chefs')
const Receita = require('../models/recipes')
const File = require('../models/File')
const User = require('../models/users')
const CascateRecipes = require('../services/cascateRecipes')
const CascateFiles = require('../services/cascateFiles')
const GetImage = require('../services/getImage')

module.exports = {
    async create(req, res) {
        try {
            const error = req.session.error
            if(error) {
                delete req.session.error
            }

            const userOptions = await User.findAll('', 'name, id')

            return res.render('chef/create', {userOptions, error})
        }catch(err) {
            console.error(err)
            return res.render('chef/create', {
                error: "Erro inesperado, tente novamente!"
            })
        }
    },
    async show(req, res) {
        try {
            const success = req.session.success
            if(success) {
                delete req.session.success
            }

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

            return res.render('chef/show', {chef, receitas, success})
        }catch(err) {
            console.error(err)
            return res.render('chef/show', {
                error: "Erro inesperado, tente novamente!"
            })
        }

    },
    async edit(req, res) {
        try {
            const error = req.session.error
            if(error) {
                delete req.session.error
            }

            let chef  = await Chef.findOne({where: {id: req.params.id}})

            if(!chef) return res.send('chef not found!')

            return res.render('chef/edit', {chef, error})
        }catch(err) {
            console.error(err)
            return res.render('chef/edit', {
                error: "Erro inesperado, tente novamente!"
            })
        }
    },
    async post(req, res) {
        try {
            const file_id = await CascateFiles.createFileForChef(req.file)

            const { name, autor } = req.body
            
            const user_id = autor


            await Chef.create({
                name, user_id, file_id
            })

            req.session.success =  "Chef criado com sucesso!"

            return res.redirect('/adm/chefs')
        }catch(err) {
            console.error(err)
            return res.render('chef/create', {
                error: "Erro inesperado, tente novamente!"
            })
        }
    },
    async put(req, res) {
        try {
            const { id, name } = req.body

            await Chef.update(id, {name})

            req.session.success =  "Chef atualizado com sucesso!"

            return res.redirect(`/adm/chefs/${req.body.id}`)
        }catch(err) {
            console.error(err)
            return res.render('chef/edit', {
                error: "Erro inesperado, tente novamente!"
            })
        }
    },
    async delete(req, res) {
        try {
            // deletar receitas desse chef e suas imagens e a imagem do chef
            await CascateRecipes.deleteRecipesAndFiles(req.body.id)

            // deletar chef
            await Chef.delete(req.body.id)

            req.session.success =  "Chef apagado com sucesso!"

            return res.redirect('/adm/chefs')
        }catch(err) {
            console.error(err)
        }
    }
}