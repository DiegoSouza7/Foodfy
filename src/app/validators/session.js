const User = require('../models/Users')
const { compare } = require('bcryptjs')

module.exports = {
    async login(req, res, next) {
     const { email, password } = req.body
    
     const user = await User.findOne({ where: {email} })
     if (!user) return res.render('session/login', {
         user: req.body,
         error: "Usuário não cadastrado"
     })
     
     const passed = await compare(password, user.password)
     
     if(!passed) return res.render("session/login", {
         user: req.body,
         error: "Senha incorreta."
        })
        
        req.user = user
        
     next()
    },
    async reset(req, res, next) {
        // procurar o usuário
        
        const { email, password, token, passwordRepeat } = req.body
        
        const user = await User.findOne({ where: {email} })
        if (!user) return res.render('session/newPassword', {
            user: req.body,
            token,
            error: "Usuário não cadastrado"
        })
        
        //ver se a senha bate
        
        if(password != passwordRepeat) return res.render('session/newPassword', {
            user: req.body,
            token,
            error: 'Senha diferente.'
        })
        
        //verificar se o token bate
        
        if (token != user.reset_token) return res.render('session/newPassword', {
            user: req.body,
            token,
            error: 'Token inválido! Solicite uma nova recuperação de senha'
        })
                
        //verificar se o token não expirou

        let now = new Date()

        now = now.setHours(now.getHours())

        if(now > user.reset_token_expires) return res.render('session/newPassword', {
            user: req.body,
            token,
            error: 'Token expirado! Solicite uma nova recuperação de senha'
        })

        req.user = user
        
        next()
    },
    async forgot(req, res, next) {
        const { email } = req.body

        try {
            let user = await User.findOne({ where: { email } })
            if (!user) return res.render('session/forgot-password', {
                user: req.body,
                error: "Email não cadastrado"
            })

            req.user = user
            
            next()
        }catch(err) {
            console.error(err)
        }

    }
}