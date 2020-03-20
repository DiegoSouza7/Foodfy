const Chef = require('../models/chefs')
const File = require('../models/File')

module.exports = {
    async create(req, res) {
        try {
            const results = await Chef.userSelectOptions()
            const options = results.rows

            return res.render('chef/create', {userOptions: options})
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

            const results = await Chef.find(req.params.id)
            let chef = results.rows[0]

            if(!chef) return res.send('chef not found!')

            chef = {
                ...chef,
                path: `${req.protocol}://${req.headers.host}${chef.path.replace('public', '')}`
            }


            const resultsFind = await Chef.findReceitasChef(req.params.id)
            let receitas = resultsFind.rows

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
            const results = await Chef.find(req.params.id)
            let chef = results.rows[0]

            if(!chef) return res.send('chef not found!')

            return res.render('chef/edit', {chef})
        }catch(err) {
            console.error(err)
            return res.render('chef/edit', {
                error: "Erro inesperado, tente novamente!"
            })
        }
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)
    
            for(key of keys) {
                if (req.body[key] == '') {
                    return res.send('Por favor, preecha todos os campos!')
                }
            }
            

            if (req.files.length == 0) return res.send('Por favor, envie uma imagem')

            const filesPromise = req.files.map(file => File.create({...file}))
            const resultPromise = await Promise.all(filesPromise)
            const fileId = resultPromise[0].rows[0].id

            await Chef.create(req.body, fileId)

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
            const keys = Object.keys(req.body)

            for(key of keys) {
                if (req.body[key] == '') {
                    return res.send('Por favor, preecha todos os campos!')
                }
            }

            await Chef.update(req.body)

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
            await Chef.delete(req.body.id)

            req.session.success =  "Chef apagado com sucesso!"

            return res.redirect('/adm/chefs')
        }catch(err) {
            console.error(err)
        }
    }
}