const Chef = require('../models/chefs')
const Receita = require('../models/recipes')
const {date} = require('../../lib/utils')

module.exports = {
    init(req, res) {
        let { filter, page, limit } = req.query
    
            page = page || 1
            limit = limit || 14
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

                    return res.render('adm/adm', {receitas, pagination, filter})
                }
            }
    
            Receita.paginate(params)
    },
    chefs(req, res) {
        let { filter, page, limit } = req.query
    
            page = page || 1
            limit = limit || 14
            let offset = limit * (page - 1)
    
            const params = {
                filter,
                page,
                limit,
                offset,
                callback(chefs) {
    
                    const pagination = {
                        total: Math.ceil(chefs[0].total / limit),
                        page
                    }

                    return res.render('adm/chefs', {chefs, pagination, filter})
                }
            }
    
            Chef.paginate(params)
    },
    show(req, res) {
        Receita.find(req.params.id, function(receita) {
            if(!receita) return res.send('receita not found!')

            receita.created_at = date(receita.created_at).format

            return res.render('adm/show', {receita})
        })
    },
    chefShow(req, res) {
        Chef.find(req.params.id, function(chef) {
            if(!chef) return res.send('chef not found!')

            chef.created_at = date(chef.created_at).format

            Chef.findReceitasChef(req.params.id, function(receitas) {

                return res.render('adm/chefShow', {chef, receitas})
            })
        })
    },
    create(req, res) {
        Receita.chefSelectOptions(function(options) {
            return res.render('adm/create', {chefOptions: options})
        })
    },
    createChef(req, res) {
        return res.render('adm/createChef')
    },
    editChef(req, res) {
        Chef.find(req.params.id, function(chef) {
            if(!chef) return res.send('chef not found!')

            chef.created_at = date(chef.created_at).format
            
            return res.render('adm/editChef', {chef})
        })
    },
    edit(req, res) {
        Receita.find(req.params.id, function(receita) {
            if(!receita) return res.send('Receita not found!')

            receita.created_at = date(receita.created_at).format

            Receita.chefSelectOptions(function(options) {
                return res.render('adm/edit', {receita, chefOptions: options})
            })
        })
    },
    post(req, res) {
        const keys = Object.keys(req.body)
        campos = 0
    
        for(key of keys) {
            if (req.body[key] == '') {
                return res.send('Por favor, preecha todos os campos!')
            }
        campos = campos + 1
        }
        if(campos >= 6) {
            Receita.create(req.body, function() {
                return res.redirect('/adm')   
            })
        } else if(campos == 2) {
            Chef.create(req.body, function() {
                return res.redirect('/adm')
            })
        }
    },
    put(req, res) {
        const keys = Object.keys(req.body)
        campos = 0
        for(key of keys) {
            if (req.body[key] == '') {
                return res.send('Por favor, preecha todos os campos!')
            }
            campos = campos + 1
        }

        if(campos >= 6) {
            Receita.update(req.body, function() {
                return res.redirect(`/adm/${req.body.id}`)
            })
        } else if(campos == 2) {
            Chef.update(req.body, function() {
                return res.redirect(`/adm/chefs/${req.body.id}`)
            })
        }
    },
    delete(req, res) {

        Receita.delete(req.body.id, function() {
                return res.redirect('/adm')
        })

        Chef.delete(req.body.id, function() {
            return res.redirect('/adm')
        })

    }
}