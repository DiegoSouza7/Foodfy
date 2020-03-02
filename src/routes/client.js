const express = require('express')
const routes = express.Router()

const receitas = require('../app/controllers/recipes')


//client

routes.get('/index', receitas.index)
routes.get('/receitas', receitas.receitas)
routes.get('/sobre', receitas.sobre)
routes.get('/chefs', receitas.chefs)
routes.get('/chef:id', receitas.chefsShow)
routes.get('/receita:id', receitas.receita)


module.exports = routes