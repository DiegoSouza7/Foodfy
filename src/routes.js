const express = require('express')
const routes = express.Router()
const receitas = require('./app/controllers/recipes')
const adm = require('./app/controllers/adm')

routes.get('/', function(req, res) {
    return res.redirect('/index')
})

//client

routes.get('/index', receitas.index)
routes.get('/receitas', receitas.receitas)
routes.get('/sobre', receitas.sobre)
routes.get('/chefs', receitas.chefs)
routes.get('/chef:id', receitas.chefsShow)
routes.get('/receita:id', receitas.receita)

//adm

routes.get('/adm', adm.init)
routes.get('/adm/chefs', adm.chefs)
routes.get('/adm/create', adm.create)
routes.get('/adm/createChef', adm.createChef)
routes.get('/adm/chefs/:id', adm.chefShow)
routes.get('/adm/:id', adm.show)
routes.get('/adm/chefs/:id/edit', adm.editChef)
routes.get('/adm/:id/edit', adm.edit)
routes.post('/adm', adm.post)
routes.put('/adm', adm.put)
routes.delete('/adm', adm.delete)

module.exports = routes