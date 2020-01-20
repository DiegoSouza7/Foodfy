const db = require('../../config/db')
const {date} = require('../../lib/utils')

module.exports = {
    all(callback) {
        db.query(`SELECT receitas.title, chefs.nome AS autor
        FROM receitas LEFT JOIN chefs ON(receitas.chef_id = chefs.id)
        GROUP BY (receitas.title, chefs.nome)
        `, function(err, results) {
            if (err) throw `Database Error! ${err}`
            
            callback(results.rows)
        })
    },
    create(data, callback) {
        const query = `
            INSERT INTO receitas (
                image,
                title,
                ingredients,
                preparation,
                information, 
                chef_id, 
                created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
        `

        const values = [
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.autor,
            date(Date.now()).iso
        ]

        db.query(query, values, function(err, results) {
            if(err) throw `Database Error! ${err}`
            callback(results.rows[0])
        })
    },
    chefSelectOptions(callback) {
        db.query(`SELECT nome, id FROM chefs`, function(err, results) {
            if (err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    paginate(params) {
        const {filter, limit, offset, callback} = params

        let query ='',
            filterQuery='',
            totalQuery=`(
                SELECT COUNT(*) FROM receitas
            ) AS total`        

        if (filter) {
            filterQuery = `
            WHERE receitas.title ILIKE '%${filter}%'
            OR chefs.nome ILIKE '%${filter}%'
            `
            totalQuery = `(
                SELECT COUNT(*) FROM receitas LEFT JOIN chefs 
                ON (receitas.chef_id = chefs.id)
                ${filterQuery}
            ) AS total`
        }

        query = `
        SELECT receitas.*, ${totalQuery}, chefs.nome AS autor
        FROM receitas
        LEFT JOIN chefs ON (chefs.id = receitas.chef_id)
        ${filterQuery}
        GROUP BY (receitas.id, chefs.nome) 
        LIMIT $1 OFFSET $2
        `
        
        db.query(query, [limit, offset], function(err, results) {
            if (err) throw `Database Error! ${err}` 

            callback(results.rows)
        })
    },
    find(id, callback) {
        db.query(`
            SELECT receitas.*, chefs.nome AS autor FROM receitas 
            LEFT JOIN chefs ON (chefs.id = receitas.chef_id) 
            WHERE receitas.id = $1`, [id], function(err, results) {
            if (err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
    },
    update(data, callback) {
        const query = `
            UPDATE receitas SET
                image=($1),
                title=($2),
                ingredients=($3),
                preparation=($4),
                information=($5), 
                chef_id=($6)
                WHERE id = $7
                
        `

        const values = [
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.autor,
            data.id
        ]

        db.query(query, values, function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback()
        })
    },
    delete(id, callback) {
        db.query(`DELETE FROM receitas WHERE id = $1`, [id], function(err, results) {
            if(err) throw `Database Error! ${err}`

            return callback()
        })
    }
}