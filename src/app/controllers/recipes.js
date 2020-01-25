const Receita = require('../models/recipes')
const Chef = require('../models/chefs')
const {date} = require('../../lib/utils')

module.exports = {
    index(req, res) {
        let { filter, page, limit } = req.query
    
            page = page || 1
            limit = limit || 6
            let offset = limit * (page - 1)
    
            const params = {
                filter,
                page,
                limit,
                offset,
                callback(receitas) {
    
                    const pagination = {
                        total: Math.ceil(receitas[0].total / limit),
                        page
                    }

                    return res.render('client/index', {receitas, pagination, filter})
                }
            }
            Receita.paginate(params)
    },
    receitas(req, res) {
        let { filter, page, limit } = req.query
    
            page = page || 1
            limit = limit || 12
            let offset = limit * (page - 1)
    
            const params = {
                filter,
                page,
                limit,
                offset,
                callback(receitas) {
                    
                    if (receitas.length == 0) {
                        return res.render('client/receitasNot', {filter})
                    } else {
                        const pagination = {
                            total: Math.ceil(receitas[0].total / limit),
                            page
                        }
                        
                        return res.render('client/receitas', {receitas, pagination, filter})
                    }                    
                }                
            }

            Receita.paginate(params)
    },
    sobre(req, res) {
        return res.render('client/sobre')
    },
    receita(req, res) {
        Receita.find(req.params.id, function(receita) {
            if(!receita) return res.send('receita not found!')

            receita.created_at = date(receita.created_at).format

            return res.render('client/receita', {receita})
        })
    },
    chefs(req, res) {
        Chef.chefs(function(chefs) {
            return res.render('client/chefs', {chefs})
        })
    },
    chefsShow(req, res) {
        Chef.find(req.params.id, function(chef) {
            if(!chef) return res.send('chef not found!')

            chef.created_at = date(chef.created_at).format

            Chef.findReceitasChef(req.params.id, function(receitas) {

                return res.render('client/chefShow', {chef, receitas})
            })
        })
    }
}