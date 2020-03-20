const { compare } = require('bcryptjs')
const User = require('../models/users')

module.exports = {
    async update(req, res, next) {
        const id = req.session.userId
        const { password } = req.body

        if (!password) return res.render("user/index", {
            user: req.body,
            error: "Coloque sua senha para atualizar seu cadastro."
        })

        const user = await User.findOne({ where: {id} })
        
        const passed = await compare(password, user.password)

        if(!passed) return res.render("user/index", {
            user: req.body,
            error: "Senha incorreta."
        })

        req.user = user

        next()
    },
    async adm(req, res, next) {
        const id = req.session.userId

        let user = await User.findOne({where: {id}})

        if(user.is_admin == true) {
            user = {
                adm: ''
            }
        } else {
            user = {
                adm: user.id
            }
        }
        req.user = user        

        next()
    }
}