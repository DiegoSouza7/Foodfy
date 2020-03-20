const File = require('../models/File')
const Receita = require('../models/recipes')

module.exports = {
    async create(req, res) {
        try {
            const id = req.user.adm
            const results = await Receita.chefSelectOptions(id)
            const options = results.rows

            return res.render('recipe/create', {chefOptions: options})
        }catch(err) {
            console.error(err)
        }
    },
    async show(req, res) {
        try {
            const success = req.session.success
            if(success) {
                delete req.session.success
            }

            const results = await Receita.find(req.params.id)

            let receita = results.rows[0]
    
            if(!receita) return res.send('receita not found!')

            async function getImage(recipeId) {
                let results = await File.recipeFile(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)
                return files
            }

            receita.file = await getImage(receita.id)
        
            return res.render('recipe/show', {receita, success})
        }catch(err) {
            console.error(err)
        }
    },
    async edit(req, res) {
        try {
            const results = await Receita.find(req.params.id)
            const receita = results.rows[0]
            if(!receita) return res.send('Receita not found!')
            const id = req.user.adm
        
            const resultsChef = await Receita.chefSelectOptions(id)
            const options = resultsChef.rows

            // get images
            const resultsFiles = await File.recipeFile(receita.id)
            let files = resultsFiles.rows
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }))
    
            return res.render('recipe/edit', {receita, chefOptions: options, files})
        }catch(err) {
            console.error(err)
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
    
            const resultsRecipes = await Receita.create(req.body)
            const receita = resultsRecipes.rows[0]


            const filesPromise = req.files.map(file => File.create({...file}))
            const resultFiles = await Promise.all(filesPromise)
            
            await resultFiles.map(file => File.createConstraing(receita.id, file.rows[0].id))
            
            req.session.success =  "Receita criada com sucesso!"
            
            return res.redirect('/adm')
        }catch(err) {
            console.error(err)
        }
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body)
            
            for(key of keys) {
                if (req.body[key] == '' && key != "removed_files" && key != 'photos') {
                    return res.send('Por favor, preecha todos os campos!')
                }
            }

            if(req.files.length != 0) {
                const filesPromise = req.files.map(file => File.create({...file}))
                const resultFiles = await Promise.all(filesPromise)
                
                await resultFiles.map(file => File.createConstraing(req.body.id, file.rows[0].id))
            }
            
            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(',')
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)
                
                const removedFilesPromise = removedFiles.map(id => File.delete(id))
                
                await Promise.all(removedFilesPromise)
            }
            
            await Receita.update(req.body)

            req.session.success =  "Receita atualizada com sucesso!"
            
            return res.redirect(`/adm/${req.body.id}`)
        }catch(err) {
            console.error(err)
        }
    },
    async delete(req, res) {
        try {
            const results = File.recipeFile(req.body.id)
            const files = (await results).rows
            await files.map(file => File.delete(file.file_id))

            await File.deleteConstraing(req.body.id)

            await Receita.delete(req.body.id)

            req.session.success =  "Receita apagada com sucesso!"
        
            return res.redirect('/adm')
        }catch(err) {
            console.error(err)
        }
    }
}