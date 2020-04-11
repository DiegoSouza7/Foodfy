const File = require('../models/File')
const RecipeFile = require('../models/recipeFiles')

module.exports = {
    async getImage(id) {
        const recipeFiles = await RecipeFile.findAll({where: {recipe_id: id}})
        const filesPromise = recipeFiles.map(recipeFile => File.findOne({where: {id: recipeFile.file_id}}))
        let files = await Promise.all(filesPromise)

        files = files.map(file => `${file.path.replace('public', '')}`)
        return files[0]
    },
    async getImages(id) {
        const recipeFiles = await RecipeFile.findAll({where: {recipe_id: id}})
        const filesPromise = recipeFiles.map(recipeFile => File.findOne({where: {id: recipeFile.file_id}}))
        let files = await Promise.all(filesPromise)

        files = files.map(file => `${file.path.replace('public', '')}`)
        return files
    }
}