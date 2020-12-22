const express = require('express')
const routes = express.Router()

const adm = require('./adm')
const client = require('./client')

// home
routes.get('/', function (req, res) {
	return res.redirect('/index')
})

routes.use('/adm', adm)
routes.use('/', client)



module.exports = routes