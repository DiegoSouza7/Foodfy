const crypto = require('crypto')
const { hash } = require('bcryptjs')
const User = require('../models/users')
const Chef = require('../models/chefs')
const mailer = require('../../config/mailer')
const RandomPassword = require('../../lib/randomPassword')
const CascateChefs = require('../services/cascateChefs')

module.exports = {
    async index(req, res) {
        try {
            const error = req.session.error
            if(error) {
                delete req.session.error
            }
            const success = req.session.success
            if(success) {
                delete req.session.success
            }

            let id = req.session.userId

            const result = await User.findOne({where: {id}})
    
            const { name, email } = result
    
            const user = {id, name, email}
    
            return res.render('user/index', { user, error, success })

        }catch(err) {
            console.error(err)
        }
    },
    async updateUser(req, res) {
        try {
            const { name } = req.body
            const { id } = req.user
    
            await User.update(id, { name })

            req.session.success = "Usuário atualizado com sucesso!"
    
            return res.redirect('/adm/user')

        }catch(err) {
            console.error(err)
            return res.render('user/index', {
                error: "Erro inesperado, tente novamente!"
            })
        }
    },
    async create(req, res) {
        const error = req.session.error
        if(error) {
            delete req.session.error
        }

        return res.render('user/create', {error})
    },
    async post(req, res) {
        try {
            let { name, email, is_admin } = req.body

            const userExist = await User.findOne({where: {email}})
            
            if(userExist) {
                return res.render('user/create', {
                    error: 'Email já cadastrado!'
                })
            }
            
            if (is_admin) {
                is_admin = true
            } else {
                is_admin = false
            }

            // criar um password random

            let password = RandomPassword.randomPassword()
            password = await hash(password, 10)

            // token para ser enviado um email de criar a senha

            const reset_token = crypto.randomBytes(20).toString('hex')
            
            // criar uma expiração para o token

            let now = new Date()
            now = now.setHours(now.getHours() + 1)
            const  reset_token_expires = now
            
            //criar o usuário

            await User.create({
                name, 
                email, 
                is_admin, 
                password,
                reset_token, 
                reset_token_expires
            })
            

            await mailer.sendMail({
                to: email,
                from: 'no-reply@foodfy.com',
                subject: 'Criar uma Senha',
                html: `<h2>Obrigado pelo cadastro</h2>
                <p>Clique no link para criar a sua senha</p>
                <p>
                    <a href="http://localhost:3000/adm/user/password-reset?token=${reset_token}" target="_blanck">
                    CRIAR SENHA
                    </a>
                </p>
                `
            })

            req.session.success = "Usuário criado com sucesso!"

            return res.redirect('/adm/users')

        }catch(err) {
            console.error(err)
            return res.render('user/create', {
                error: "Erro inesperado, tente novamente!"
            })
        }
    },
    async edit(req, res) {
        try {
            const error = req.session.error
            if(error) {
                delete req.session.error
            }

            const id = req.params.id

            const result = await User.findOne({where: {id}})
            
            const { name, email, is_admin } = result
    
            const user = {id, name, email, is_admin}
    
            return res.render('user/edit', {user, error})
        }catch (err) {
            console.error(err)
        }
    },
    async put(req, res) {
        try {
            let { id, name, email, is_admin} = req.body

            const result = await User.findOne({ where: {id} })

            let user = req.body

            if((req.session.userId == id) && !is_admin) {
                return res.render('user/edit', {
                user,
                error: "Você não pode remover essa função de sua conta!"
            })}
            
            if((email != result.email) || !result) {
                return res.render('user/edit', {
                    user,
                    error: "Você não pode alterar o e-mail de sua conta!"
                })
            }
    
            if (is_admin) {
                is_admin = true
            } else {
                is_admin = false
            }
            
            await User.update(result.id, {name, is_admin})
            
            req.session.success = "Usuário atualizado com sucesso!"

            return res.redirect('/adm/users')
        } catch(err) {
            console.error(err)
            return res.render('user/edit', {
                error: "Erro inesperado, tente novamente!"
            })
        }
    },
    async delete(req, res) {
        try {
            let users = await User.findAll()

            if(req.session.userId == req.body.id) {
                req.session.error = "Você não pode deletar sua própria conta!"

                return res.redirect('/adm/users' )
            } else {
                //pegar os chefs daquele usuario e deletar
                const chefs = await Chef.findAll({where: {user_id: req.body.id}})

                const allChefsPromise = chefs.map(chef => CascateChefs.deleteChefsAndRecipes(chef.id))

                await Promise.all(allChefsPromise)

                await User.delete(req.body.id)

                req.session.success = "Usuário deletado com sucesso!"

                return res.redirect('/adm/users')
            }

        }catch (err) {
            console.error(err)
            return res.render('adm/users', {
                error: "Erro inesperado, tente novamente!"
            })
        }
    }
}