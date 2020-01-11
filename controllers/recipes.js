const data = require('../data.json')

exports.index = function(req, res) {
    return res.render('client/index', { receitas: data.receitas })
}

exports.receitas = function(req, res) {
    return res.render('client/receitas', { receitas: data.receitas })
}

exports.sobre = function(req, res) {
    return res. render('client/sobre')
}

exports.receita = function(req, res) {
    const {id} = req.params
    const receita = data.receitas.find(function(receita) {
        return id == receita.id
    })

    if (!receita) {
        return res.send('Receita not found!')
    }

    return res.render('client/receita', {receita})
}