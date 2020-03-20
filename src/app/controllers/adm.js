const Chef = require('../models/chefs')
const Receita = require('../models/recipes')
const File = require('../models/File')
const User = require('../models/users')

module.exports = {
    async index(req, res) {
        try {
            const success = req.session.success
            if(success) {
                delete req.session.success
            }


            let results,
            params = {},
            { page, limit, filter } = req.query,
            id = req.user.adm      
            
            page = page || 1
            limit = limit || 14
            let offset = limit * (page - 1)
            
            params = {
                filter,
                id,
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
                return res.render('adm/adm', { filter })
            } else {
                const pagination = {
                    total: Math.ceil(receitas[0].total / limit),
                    page
                }
                
                return res.render('adm/adm', {receitas, pagination, filter, success})
            }

        }catch(err) {
            console.error(err)
        }
        
    },
    async chefs(req, res) {
        try {
            const success = req.session.success
            if(success) {
                delete req.session.success
            }

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
                return res.render('adm/chefs')
            } else{
                const pagination = {
                    total: Math.ceil(chefs[0].total / limit),
                    page
                }

                return res.render('adm/chefs', { chefs, pagination, filter, success})
            }
            
        }catch(err) {
            console.error(err)
        }
        
    },
    async users(req, res) {
        try {
            const results = await User.all()

            const users = results.rows

            const success = req.session.success
            if(success) {
                delete req.session.success
            }

            return res.render('adm/users', { users, success })
        }catch(err) {
            console.error(err)
        }
    }
}