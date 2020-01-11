const express = require('express')
const routes = express.Router()
const receitas = require('./controllers/recipes')
const adm = require('./controllers/adm')

routes.get('/', function(req, res) {
    return res.redirect('/index')
})

//client

routes.get('/index', receitas.index)
routes.get('/receitas', receitas.receitas)
routes.get('/sobre', receitas.sobre)
routes.get('/receita:id', receitas.receita)

//adm

routes.get('/adm', adm.init)
routes.get('/adm/create', adm.create)
routes.get('/adm/:id', adm.show)
routes.get('/adm/:id/edit', adm.edit)
routes.post('/adm', adm.post)
routes.put('/adm', adm.put)
routes.delete('/adm', adm.delete)

module.exports = routes