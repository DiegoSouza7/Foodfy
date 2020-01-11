const fs = require('fs')
const data = require('../data.json')

exports.init = function(req, res) {
    return res.render('adm/adm', { receitas: data.receitas })
}

exports.show = function(req, res) {
    const {id} = req.params

    const receita = data.receitas.find(function(receita) {
        return id == receita.id
    })
    
    if (!receita) {
        return res.send('Receita not found!')
    }

    return res.render('adm/show', {receita})
}

exports.create = function(req, res) {
    return res.render('adm/create')
}

exports.edit = function(req, res) {
    const {id} = req.params
    const receita = data.receitas.find(function(receita) {
        return id == receita.id
    })
    
    if (!receita) {
        return res.send('Receita not found!')
    }

    return res.render('adm/edit', { receita })
}

exports.post = function(req, res) {
    const keys = Object.keys(req.body)

    for(key of keys) {
        if (req.body[key] == '') {
            return res.send('Por favor, preecha todos os campos!')
        }
    
    }
    let { image, title, author, ingredients, preparation, information } = req.body

    const id = Number(data.receitas.length + 1)


    data.receitas.push({
        id,
        image,
        title,
        author,
        ingredients,
        preparation,
        information
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Erro no envio do arquivo")

    return res.redirect('/adm')
    })
}

exports.put = function(req, res) {
    const {id} = req.body
    let index = 0

    const foundReceita = data.receitas.find(function(receita, foumdIndex) {
        if (id == receita.id) {
            index = foumdIndex
            return true
        }
    })
    
    if (!foundReceita) {
        return res.send('Receita not found!')
    }

    const receita = {
        ...foundReceita,
        ...req.body,
        id: Number(req.body.id)
    }

    data.receitas[index] = receita

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('write error!')

        return res. redirect(`adm/${id}`)
    })
}

exports.delete = function(req, res) {
    const {id} = req.body

    const filterReceitas = data.receitas.filter(function(receita) {
        return receita.id != id
    })

    data.receitas = filterReceitas

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send('write file error')

        return res.redirect('/adm')
    })
}