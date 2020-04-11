const Recipe = require('../models/recipes')
const CascateFiles = require('./cascateFiles')
const Chef = require('../models/chefs')

module.exports = {
    async deleteRecipesAndFiles(id) {
        // deletar receitas e suas imagens
        const recipes = await Recipe.findAll({where: {chef_id: id}})
        
        recipes.map(async recipe => await CascateFiles.deleteRecipeFiles(recipe.id))
        
        recipes.map(async recipe => await Recipe.delete(recipe.id))
        
        // deletar imagem do chef
        const chef = await Chef.findOne({where: {id}})

        await CascateFiles.deleteFiles(chef.file_id)
    }
}