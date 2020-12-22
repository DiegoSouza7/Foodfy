const User = require('../models/users')

module.exports = {
	onlyUsers(req, res, next) {
		if (!req.session.userId) return res.redirect('/adm/login')

		next()
	},
	isLoggedRedirectToUsers(req, res, next) {
		if (req.session.userId) return res.redirect('/adm')

		next()
	},
	async isAdm(req, res, next) {
		const id = req.session.userId

		const user = await User.findOne({
			where: {
				id
			}
		})

		if (user.is_admin == false) {
			req.session.error = 'Você não possui o cargo de administrador!'
			return res.redirect('/adm')
		} else if (user.is_admin == true) {
			next()
		}
	}
}