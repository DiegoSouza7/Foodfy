const User = require('../models/users')
const crypto = require('crypto')
const mailer = require('../../config/mailer')
const RandomPassword = require('../../lib/randomPassword')

module.exports = {
    async index(req, res) {
        try {
            let id = req.session.userId

            const result = await User.findOne({where: {id}})
    
            const { name, email } = result
    
            const user = {id, name, email}
    
            return res.render('user/index', { user })

        }catch(err) {
            console.error(err)
        }
    },
    async updateUser(req, res) {
        try {
            const { name } = req.body
            const { id } = req.user
    
            await User.updateName(id, name)
            const user = req.body
    
            return res.render('user/index', {
                user,
                success: "Usuário atualizado com sucesso!"
            })

        }catch(err) {
            console.error(err)
            return res.render('user/index', {
                error: "Erro inesperado, tente novamente!"
            })
        }
    },
    async create(req, res) {
        return res.render('user/create')
    },
    async post(req, res) {
        try {
            let user = req.body

            const { email } = user
            const userExist = await User.findOne({where: {email}})

            if(userExist) {
                return res.render('user/create', {
                    error: 'Email já cadastrado!'
                })
            }

            const password = RandomPassword.randomPassword()

            if(user.isAdm) user = {
                ...user,
                isAdm: true
            }
            
            user = await User.create(user, password)
            
            // token para ser enviado um email de criar a senha

            const token = crypto.randomBytes(20).toString('hex')

            // criar uma expiração para o token

            let now = new Date()
            now = now.setHours(now.getHours() + 1)
            const  reset_token_expires = now

            await User.updateTokens(user.id, token, reset_token_expires)


            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com',
                subject: 'Criar uma Senha',
                html: `<h2>Obrigado pelo cadastro</h2>
                <p>Clique no link para criar a sua senha</p>
                <p>
                    <a href="http://localhost:3000/adm/user/password-reset?token=${token}" target="_blanck">
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
            const id = req.params.id

            const result = await User.findOne({where: {id}})
            
            const { name, email, is_admin } = result
    
            const user = {id, name, email, is_admin}
    
            return res.render('user/edit', {user})
        }catch (err) {
            console.error(err)
        }
    },
    async put(req, res) {
        try {
            const { email, isAdm } = req.body
            const result = await User.findOne({ where: {email} })
    
            let user = req.body
    
            if(user.isAdm) user = {
                ...user,
                isAdm: true
            }
            
            await User.updateUser(result.id, user.name, user.isAdm)
            
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
            let results = await User.all()

            let users = results.rows

            if(req.session.userId == req.body.id) {
                return res.render('adm/users', {
                users,
                error: "Você não pode deletar sua própria conta!"
            })} else {
                await User.delete(req.body.id)
                results = await User.all()

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