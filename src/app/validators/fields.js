module.exports = {
	post(req, res, next) {
		const keys = Object.keys(req.body)
		for (key of keys) {
			if ((req.body[key] == '') || (!req.body[key])) {
				req.session.error = "Por favor preencha todos os campos!"
				return res.redirect('/adm/create')
			}
		}
		if (req.files == '') {
			req.session.error = "Por favor envie pelo menos uma foto!"
			return res.redirect('/adm/create')
		}

		next()
	},
	put(req, res, next) {
		const keys = Object.keys(req.body)

		for (key of keys) {
			if (req.body[key] == '' && key != "removed_files" && key != 'photos') {
				req.session.error = 'Por favor, preencha todos os campos!'
				return res.redirect(`/adm/${req.body.id}/edit`)
			}
		}

		next()
	},
	postChef(req, res, next) {
		const keys = Object.keys(req.body)
		for (key of keys) {
			if ((req.body[key] == '') || (!req.body[key])) {
				req.session.error = "Por favor preencha todos os campos!"
				return res.redirect('/adm/chefs/create')
			}
		}
		if ((req.file == '') || !req.file) {
			req.session.error = "Por favor envie uma foto!"
			return res.redirect('/adm/chefs/create')
		}

		next()
	},
	putChef(req, res, next) {
		const keys = Object.keys(req.body)

		for (key of keys) {
			if (req.body[key] == '') {
				req.session.error = 'Por favor, preencha todos os campos!'
				return res.redirect(`/adm/chefs/${req.body.id}/edit`)
			}
		}

		next()
	},
	postUser(req, res, next) {
		const {
			name,
			email
		} = req.body
		if ((name == '') || (email == '')) {
			req.session.error = 'Por favor, preencha os campos de nome e e-mail!'
			return res.redirect('/adm/users/create')
		}
		next()
	},
	putUser(req, res, next) {
		const {
			name,
			email,
			id
		} = req.body
		if ((name == '') || (email == '')) {
			req.session.error = 'Os campos nome e e-mail não podem estar vazios'
			return res.redirect(`/adm/users/${id}`)
		}
		next()
	}
}