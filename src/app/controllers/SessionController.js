const { hash } = require('bcryptjs')
const crypto = require('crypto')
const mailer = require('../../config/mailer')
const User = require('../models/users')

module.exports = {
    loginForm(req, res) {
        return res.render('session/login')
    },
    login(req, res) {
        req.session.userId = req.user.id

        return res.redirect('/adm/user')
    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect('/')
    },
    forgotForm(req, res) {
        return res.render('session/forgot-password')
    },
    newPasswordForm(req, res) {
        return res.render('session/newPassword', {token: req.query.token})
    },
    async forgot(req, res) {
        const { user } = req

        try {
            // token para ser enviado um email de alterar a senha

            const reset_token = crypto.randomBytes(20).toString('hex')

            // criar uma expiração para o token

            let now = new Date()
            now = now.setHours(now.getHours() + 1)
            const  reset_token_expires = now

            await User.update(user.id, {reset_token, reset_token_expires})


            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com',
                subject: 'Recuperação de senha',
                html: `<h2>Perdeu a senha?</h2>
                <p>Clique no link para recuperar sua senha</p>
                <p>
                    <a href="http://localhost:3000/adm/user/password-reset?token=${reset_token}" target="_blanck">
                    CRIAR SENHA
                    </a>
                </p>
                `
            })

            // avisar o usuario que enviamos o email

            return res.render('session/forgot-password', {
            success: "Verifique seu email para resetar sua senha!"
        })
        }catch (err) {
            console.error(err)
            return res.render('session/forgot-password', {
                error: "Erro inesperado, tente novamente!"
            })
        }
    },
    async reset(req, res) {
        const { user } = req
        let { password, reset_token } = req.body

        try {
            // criar um novo hash de senha

            password = await hash(password, 8)

            // atualiza o usuário
            await User.update(user.id, {
                password, 
                reset_token: '',
                reset_token_expires: ''
            })

            // avisa o usuário que ele tem uma nova senha 

            return res.render('session/login', {
                user: req.body,
                success: 'Senha atualizada! Faça o seu login'
            })


        }catch(err) {
            console.error(err)
            return res.render('session/newPassword', {
                user: req.body,
                reset_token,
                error: "Erro inesperado, tente novamente!"
            })
        }
    }
}