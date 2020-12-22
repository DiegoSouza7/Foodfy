const Chef = require('../models/chefs')
const CascateRecipes = require('./cascateRecipes')


module.exports = {
	async deleteChefsAndRecipes(id) {
		// deletar receitas desse chef e suas imagens e a imagem do chef
		await CascateRecipes.deleteRecipesAndFiles(id)

		// deletar chef
		await Chef.delete(id)
	}
}