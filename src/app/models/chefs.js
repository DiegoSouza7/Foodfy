const db = require('../../config/db')
const {date} = require('../../lib/utils')

module.exports = {
    all(callback) {
        db.query(`SELECT chefs.nome, COUNT(receitas) AS receitas
        FROM chefs LEFT JOIN receitas ON(receitas.chef_id = chefs.id)
        GROUP BY chefs.id
        `, function(err, results) {
            if (err) throw `Database Error! ${err}`
            
            callback(results.rows)
        })
    },
    find(id, callback) {
        db.query(`SELECT chefs.*,
        COUNT(receitas) AS total  
        FROM chefs LEFT JOIN receitas ON
        (chefs.id = receitas.chef_id) WHERE chefs.id = $1 
        GROUP BY chefs.id`, [id], function(err, results) {
            if(err) throw `Database Error ${err}`

            callback(results.rows[0])
        })
    },
    findReceitasChef(id, callback) {
        db.query(`SELECT receitas.*, chefs.nome AS autor 
        FROM receitas LEFT JOIN chefs 
        ON (receitas.chef_id = chefs.id)
        WHERE receitas.chef_id = $1`, [id], function(err, results) {
            if (err) throw `Database Error ${err}`

            callback(results.rows)
        })
    },
    create(data, callback) {
        const query = `
            INSERT INTO chefs (
                nome, 
                avatar_url, 
                created_at
                ) VALUES ($1, $2, $3)
                RETURNING id
        `

        const values = [
            data.nome,
            data.avatar_url,
            date(Date.now()).iso
        ]

        db.query(query, values, function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
    },
    update(data, callback) {
        const query = `
            UPDATE chefs SET
                avatar_url=($1),
                nome=($2)
                WHERE id = $3
                
        `

        const values = [
            data.avatar_url,
            data.nome,
            data.id
        ]

        db.query(query, values, function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback()
        })
    },
    delete(id, callback) {
        db.query(`DELETE FROM chefs WHERE id = $1`, [id], function(err, results) {
            if(err) throw `Database Error! ${err}`

            return callback()
        })
    },
    paginate(params) {
        const {filter, limit, offset, callback} = params

        let query ='',
            filterQuery='',
            totalQuery=`(
                SELECT COUNT(*) FROM chefs
            ) AS total`

        if (filter) {
            filterQuery = `
            WHERE chefs.nome ILIKE '%${filter}%'
            `
            totalQuery = `(
                SELECT COUNT(*) FROM chefs
                ${filterQuery}
            ) AS total`
        }

        query = `
        SELECT *, ${totalQuery}
        FROM chefs
        ${filterQuery}
        LIMIT $1 OFFSET $2
        `
        
        db.query(query, [limit, offset], function(err, results) {
            if (err) throw 'Database Error!'

            callback(results.rows)
        })
    },
    chefs(callback) {
        const query = `SELECT chefs.*, COUNT(receitas) AS total 
        FROM chefs LEFT JOIN receitas ON (chefs.id = receitas.chef_id)
        GROUP BY chefs.id`

        db.query(query, function(err, results) {
            if(err) throw `Database Error ${err}`

            callback(results.rows)
        })
    }
}