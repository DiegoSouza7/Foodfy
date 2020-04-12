const { unlinkSync } = require('fs')
const File = require('../models/File')
const RecipeFile = require('../models/recipeFiles')


module.exports = {
    async deleteFiles(id) {
        try {
            const image = await File.findOne({where: {id}})
            const recipeFile = await RecipeFile.findOne({where: {file_id: id}})
            
            File.delete(id)
            if(recipeFile) RecipeFile.delete(recipeFile.id)
            
            unlinkSync(image.path)
        } catch (error) {
            console.error(error)
        }
    },
    async deleteRecipeFiles(id) {
        try {
            const recipe_id = id
            const files = await RecipeFile.findAll({where: {recipe_id}})
    
            await files.map(async file => this.deleteFiles(file.file_id))
        } catch (error) {
            console.error(error)
        }
    },
    async createFilesAndConstraing(files, recipe_id) {
        try {
            const filesPromise = files.map(file => File.create({ name: file.filename, path: file.path.replace(/\\/g, '/') }))

            const resultFiles = await Promise.all(filesPromise)
            
            await resultFiles.map(file_id => RecipeFile.create({ recipe_id, file_id }))
        } catch (error) {
            console.error(error)   
        }
    },
    async createFileForChef(file) {
        return await File.create({ name: file.filename, path: file.path.replace(/\\/g, '/') })
    }
}