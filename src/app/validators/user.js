const {compare} = require('bcryptjs')
const User = require('../models/users')

module.exports = {
	async update(req, res, next) {
		const id = req.session.userId
		const {
			password,
			name,
			email
		} = req.body

		if ((name == '') || (email == '')) {
			req.session.error = 'Os campos nome e e-mail não podem estar vazios'
			return res.redirect(`/adm/user`)
		}

		if (!password) {
			req.session.error = "Coloque sua senha para atualizar seu cadastro."
			return res.redirect(`/adm/user`)
		}

		const user = await User.findOne({
			where: {
				id
			}
		})

		const passed = await compare(password, user.password)

		if (!passed) {
			req.session.error = "Senha incorreta"
			return res.redirect(`/adm/user`)
		}

		req.user = user

		next()
	},
	async adm(req, res, next) {
		const id = req.session.userId

		let user = await User.findOne({
			where: {
				id
			}
		})

		if (user.is_admin == true) {
			user = {
				adm: ''
			}
		} else {
			user = {
				adm: user.id
			}
		}
		req.user = user

		next()
	}
}