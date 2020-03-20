const db = require('../../config/db')
const { hash } = require('bcryptjs')
const Chef = require('./chefs')

module.exports = {
    all() {
        const query = `SELECT * FROM users`
        return db.query(query)
    },
    async findOne(filters) {
        let query = "SELECT * FROM users"
        
        Object.keys(filters).map(key => {
            query = `${query} ${key}`
            
            Object.keys(filters[key]).map(field => {
                query = `${query} ${field} = '${filters[key][field]}'`
            })
        })
        
        const results = await db.query(query)

        return results.rows[0]
    },
    async create(data, randomPassword) {
        const query = `
            INSERT INTO users (
                name,
                email,
                password,
                is_admin
            ) VALUES ($1, $2, $3, $4)
            RETURNING *
        `
        
        const password = await hash(randomPassword, 10)

        const values = [
            data.name,
            data.email,
            password,
            data.isAdm || false
        ]

        const results = await db.query(query, values)
        return results.rows[0]
    },
    async updateTokens(id, token, resetToken) {
        const query = `UPDATE users SET 
            reset_token=($1),
            reset_token_expires=($2)
            WHERE id = $3
        `

        const values = [
            token,
            resetToken,
            id
        ]

        return db.query(query, values)
    },
    async update(id,password) {
        const query = `UPDATE users SET 
            password=($1),
            reset_token='',
            reset_token_expires=''
            WHERE id = $2
        `

        const values = [
            password,
            id
        ]

        return db.query(query, values)
    },
    async updateName(id, name) {
        const query = `UPDATE users SET 
            name=($1)
            WHERE id = $2
        `
        const values = [
            name,
            id
        ]

        return db.query(query, values)
    },
    async updateUser(id, name, isAdmin) {
        const query = `UPDATE users SET 
        name=($1),
        is_admin=($2)
        WHERE id = $3
    `
        const values = [
            name,
            isAdmin || false,
            id
        ]

        return db.query(query, values)
    },
    async delete(id) {
        try {
            let results = await db.query(`SELECT * FROM chefs WHERE user_id = $1`, [id])
            const chefs = results.rows
    
            const allChefsPromise = chefs.map(async chef => Chef.delete(chef.id))

            await Promise.all(allChefsPromise)
    
            return db.query(`DELETE FROM users WHERE id = $1`, [id])
        } catch (err) {
            console.error(err)
        }
    }
}