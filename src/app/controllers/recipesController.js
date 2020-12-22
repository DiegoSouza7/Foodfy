const Receita = require('../models/recipes')
const CascateFiles = require('../services/cascateFiles')
const File = require('../models/File')
const RecipeFile = require('../models/recipeFiles')
const GetImage = require('../services/getImage')
const Chef = require('../models/chefs')

module.exports = {
	async create(req, res) {
		try {
			const error = req.session.error
			if (error) {
				delete req.session.error
			}
			const id = req.user.adm

			let options = ''

			if (id) {
				options = await Chef.findAll({
					where: {
						user_id: id
					}
				}, 'name, id')
			} else {
				options = await Chef.findAll('', 'name, id')
			}

			return res.render('recipe/create', {
				chefOptions: options,
				error
			})


		} catch (err) {
			console.error(err)
		}
	},
	async show(req, res) {
		try {
			const success = req.session.success
			if (success) {
				delete req.session.success
			}

			let receita = await Receita.findOne({
				where: {
					id: req.params.id
				}
			})

			const autor = await Chef.findOne({
				where: {
					id: receita.chef_id
				}
			}, 'chefs.name')
			receita.autor = autor.name

			if (!receita) return res.send('receita not found!')

			receita.file = await GetImage.getImages(receita.id)

			return res.render('recipe/show', {
				receita,
				success
			})
		} catch (err) {
			console.error(err)
		}
	},
	async edit(req, res) {
		try {
			const error = req.session.error
			if (error) {
				delete req.session.error
			}

			let receita = await Receita.findOne({
				where: {
					id: req.params.id
				}
			})

			const autor = await Chef.findOne({
				where: {
					id: receita.chef_id
				}
			}, 'chefs.name')
			receita.autor = autor.name


			if (!receita) return res.send('Receita not found!')
			const id = req.user.adm
			let options = ''

			if (id) {
				options = await Chef.findAll({
					where: {
						user_id: id
					}
				}, 'name, id')
			} else {
				options = await Chef.findAll('', 'name, id')
			}

			// get images
			const recipeFiles = await RecipeFile.findAll({
				where: {
					recipe_id: receita.id
				}
			})
			const filesPromise = recipeFiles.map(recipeFile => File.findOne({
				where: {
					id: recipeFile.file_id
				}
			}))
			let files = await Promise.all(filesPromise)

			files = files.map(file => ({
				...file,
				src: `${file.path.replace('public', '')}`
			}))

			return res.render('recipe/edit', {
				receita,
				chefOptions: options,
				files,
				error
			})
		} catch (err) {
			console.error(err)
		}
	},
	async post(req, res) {
		try {
			let {
				title,
				autor,
				ingredients,
				preparation,
				information
			} = req.body
			if (typeof ingredients == "string") ingredients = [ingredients]
			if (typeof preparation == "string") preparation = [preparation]

			const chef_id = autor

			if (!ingredients[ingredients.length - 1]) {
				ingredients.pop()
			}
			if (!preparation[preparation.length - 1]) {
				preparation.pop()
			}

			const receita = await Receita.create({
				title,
				chef_id,
				ingredients,
				preparation,
				information
			})

			await CascateFiles.createFilesAndConstraing(req.files, receita)

			req.session.success = "Receita criada com sucesso!"

			return res.redirect('/adm')
		} catch (err) {
			console.error(err)
		}
	},
	async put(req, res) {
		try {
			let totalRemoved = (req.body.removed_files.split(',')).length - 1
			let total = await RecipeFile.findAll({
				where: {
					recipe_id: req.body.id
				}
			})
			total = total.length

			if ((req.files.length + total) - (totalRemoved) == 0) {
				req.session.error = 'Envie pelo menos uma imagem'
				return res.redirect(`/adm/${req.body.id}/edit`)
			}

			if (req.files.length != 0) {
				if ((req.files.length + total) - (totalRemoved) > 5) {
					req.session.error = 'Só é possível enviar até 5 imagens'
					return res.redirect(`/adm/${req.body.id}/edit`)
				}
				await CascateFiles.createFilesAndConstraing(req.files, req.body.id)
			}

			if (req.body.removed_files) {
				const removedFiles = req.body.removed_files.split(',')
				const lastIndex = removedFiles.length - 1
				removedFiles.splice(lastIndex, 1)

				const removedFilesPromise = removedFiles.map(id => CascateFiles.deleteFiles(id))

				await Promise.all(removedFilesPromise)
			}

			let {
				id,
				title,
				autor,
				ingredients,
				preparation,
				information
			} = req.body
			if (typeof ingredients == "string") ingredients = [ingredients]
			if (typeof preparation == "string") preparation = [preparation]

			const chef_id = autor

			if (!ingredients[ingredients.length - 1]) {
				ingredients.pop()
			}
			if (!preparation[preparation.length - 1]) {
				preparation.pop()
			}

			await Receita.update(id, {
				title,
				chef_id,
				ingredients,
				preparation,
				information
			})

			req.session.success = "Receita atualizada com sucesso!"

			return res.redirect(`/adm/${req.body.id}`)
		} catch (err) {
			console.error(err)
		}
	},
	async delete(req, res) {
		try {
			await CascateFiles.deleteRecipeFiles(req.body.id)

			await Receita.delete(req.body.id)

			req.session.success = "Receita apagada com sucesso!"

			return res.redirect('/adm')
		} catch (err) {
			console.error(err)
		}
	}
}