const express = require('express')
const routes = express.Router()
const adm = require('../app/controllers/adm')
const chefs = require('../app/controllers/chefsControllers')
const recipes = require('../app/controllers/recipesController')
const multer = require('../app/middlewares/multer')

// adm

routes.get('/', adm.index)
routes.get('/chefs', adm.chefs)


// recipes
routes.get('/create', recipes.create)
routes.get('/:id', recipes.show)
routes.get('/:id/edit', recipes.edit)
routes.post('/create', multer.array('photos', 5), recipes.post)
routes.put('/create', multer.array('photos', 5), recipes.put)
routes.delete('/recipe', recipes.delete)


// chefs

routes.get('/chefs/create', chefs.create)
routes.post('/chefs/create', multer.array('photos', 1), chefs.post)
routes.get('/chefs/:id', chefs.show)
routes.get('/chefs/:id/edit', chefs.edit)
routes.put('/chefs', multer.array('photos', 1), chefs.put)
routes.delete('/chefs', chefs.delete)

module.exports = routes