const express = require('express')
const routes = express.Router()
const adm = require('../app/controllers/adm')
const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')
const chefs = require('../app/controllers/chefsControllers')
const recipes = require('../app/controllers/recipesController')
const multer = require('../app/middlewares/multer')
const { isLoggedRedirectToUsers, onlyUsers, isAdm } = require('../app/middlewares/session')
const SessionValidator = require('../app/validators/session')
const UserValidator = require('../app/validators/user')


// adm

routes.get('/', onlyUsers, UserValidator.adm, adm.index)
routes.get('/chefs', onlyUsers, isAdm, adm.chefs)
routes.get('/users', onlyUsers, isAdm, adm.users)

// users login

routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// create password and reset password

routes.get('/user/password-reset', SessionController.newPasswordForm)
routes.get('/user/forgot-password', SessionController.forgotForm)
routes.post('/user/password-reset', SessionValidator.reset, SessionController.reset)
routes.post('/user/forgot-password', SessionValidator.forgot, SessionController.forgot)


// users

routes.get('/user', onlyUsers, UserController.index)
routes.put('/user', onlyUsers, UserValidator.update, UserController.updateUser)

// users adm

routes.get('/users/create', onlyUsers, isAdm, UserController.create)
routes.get('/users/:id', onlyUsers, isAdm, UserController.edit)
routes.post('/users/create', onlyUsers, isAdm, UserController.post)
routes.put('/users', onlyUsers, isAdm, UserController.put)
routes.delete('/users', onlyUsers, isAdm, UserController.delete)



// recipes
routes.get('/create', onlyUsers, UserValidator.adm, recipes.create)
routes.get('/:id', onlyUsers, recipes.show)
routes.get('/:id/edit', onlyUsers, UserValidator.adm, recipes.edit)
routes.post('/create', onlyUsers, multer.array('photos', 5), recipes.post)
routes.put('/create', onlyUsers, multer.array('photos', 5), recipes.put)
routes.delete('/recipe', onlyUsers, recipes.delete)


// chefs

routes.get('/chefs/create', onlyUsers, isAdm, chefs.create)
routes.post('/chefs/create', onlyUsers, isAdm, multer.array('photos', 1), chefs.post)
routes.get('/chefs/:id', onlyUsers, isAdm, chefs.show)
routes.get('/chefs/:id/edit', onlyUsers, isAdm, chefs.edit)
routes.put('/chefs', onlyUsers, isAdm, multer.array('photos', 1), chefs.put)
routes.delete('/chefs', onlyUsers, isAdm, chefs.delete)


module.exports = routes