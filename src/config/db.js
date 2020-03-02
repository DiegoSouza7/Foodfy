const { Pool } = require('pg')

module.exports = new Pool({
    user: 'postgres',
    password: 'ninil25',
    host: 'localhost',
    port: 5432,
    database: 'foodfy'
})