const Chef = require('../models/chefs')
const Receita = require('../models/recipes')
const GetImage = require('../services/getImage')
const User = require('../models/users')

module.exports = {
	async index(req, res) {
		try {
			const success = req.session.success
			if (success) {
				delete req.session.success
			}

			const error = req.session.error
			if (error) {
				delete req.session.error
			}

			let {
				page,
				limit,
				filter
			} = req.query,
				id = req.user.adm

			page = page || 1
			limit = limit || 10
			let offset = limit * (page - 1)
			orderby = 'recipes.created_at DESC'

			const params = {
				id,
				filter,
				orderby,
				limit,
				offset
			}

			let receitas = await Receita.paginate(params)

			const receitasPromise = receitas.map(async recipe => {
				recipe.file = await GetImage.getImage(recipe.id)
				return recipe
			})

			receitas = await Promise.all(receitasPromise)

			if (receitas.length == 0) {
				return res.render('adm/adm', {
					filter
				})
			} else {
				const pagination = {
					total: Math.ceil(receitas[0].total / limit),
					page
				}

				return res.render('adm/adm', {
					receitas,
					pagination,
					filter,
					success,
					error
				})
			}

		} catch (err) {
			console.error(err)
		}

	},
	async chefs(req, res) {
		try {
			const success = req.session.success
			if (success) {
				delete req.session.success
			}

			let params = {},
				{
					page,
					limit
				} = req.query

			page = page || 1
			limit = limit || 10
			let offset = limit * (page - 1)

			params = {
				limit,
				offset
			}

			let chefs = await Chef.paginate(params)

			chefs = chefs.map(chef => ({
				...chef,
				path: `${chef.path.replace('public', '')}`
			}))

			if (chefs.length == 0) {
				return res.render('adm/chefs')
			} else {
				const pagination = {
					total: Math.ceil(chefs[0].totalchefs / limit),
					page
				}

				return res.render('adm/chefs', {
					chefs,
					pagination,
					success
				})
			}

		} catch (err) {
			console.error(err)
		}

	},
	async users(req, res) {
		try {
			const users = await User.findAll()

			const success = req.session.success

			if (success) {
				delete req.session.success
			}

			const error = req.session.error
			if (error) {
				delete req.session.error
			}

			return res.render('adm/users', {
				users,
				success,
				error
			})
		} catch (err) {
			console.error(err)
		}
	}
}