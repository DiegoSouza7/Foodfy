const express = require('express')
const nunjucks = require('nunjucks')

const receitas = require('./data')

const server = express()

server.use(express.static('public'))

server.set('view engine', 'njk')

nunjucks.configure('views', {
    express: server,
    autoescape: false,
    noCache: true
})

server.get('/', function(req, res) {
    return res.render('index', { receitas })
})

server.get('/receitas', function(req, res) {
    return res.render('receitas', {receitas})
})

server.get('/sobre', function(req, res) {
    return res. render('sobre')
})

server.get('/receita', function(req, res) {
    const id = req.query.id

    const receita = receitas.find(function(receita) {
        return receita.title == id
    })

    if (!receita) {
        return res.send('Receita not found!')
    }

    return res.render('receita', {receita})
})

server.listen(3000, function() {
    console.log('server is running')
})
