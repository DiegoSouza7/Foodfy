const db = require('../../config/db')
const {date} = require('../../lib/utils')

module.exports = {
    all() {
        return db.query(`SELECT recipes.title, chefs.name AS autor
        FROM recipes LEFT JOIN chefs ON(recipes.chef_id = chefs.id)
        GROUP BY (recipes.title, chefs.name)`)
    },
    create(data) {
        const query = `
            INSERT INTO recipes (
                title,
                ingredients,
                preparation,
                information, 
                chef_id, 
                created_at
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
        `

        const values = [
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.autor,
            date(Date.now()).iso
        ]

        return db.query(query, values)
    },
    chefSelectOptions() {
        return db.query(`SELECT name, id FROM chefs`)
    },
    paginate(params) {
        const {filter, limit, offset } = params

        let query ='',
            filterQuery='',
            totalQuery=`(
                SELECT COUNT(*) FROM recipes
            ) AS total`        

        if (filter) {
            filterQuery = `
            WHERE recipes.title ILIKE '%${filter}%'
            OR chefs.name ILIKE '%${filter}%'
            `
            totalQuery = `(
                SELECT COUNT(*) FROM recipes LEFT JOIN chefs 
                ON (recipes.chef_id = chefs.id)
                ${filterQuery}
            ) AS total`
        }

        query = `
        SELECT recipes.*, ${totalQuery}, chefs.name AS autor
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        ${filterQuery}
        GROUP BY (recipes.id, chefs.name) 
        ORDER BY recipes.created_at DESC
        LIMIT $1 OFFSET $2
        `
        
        return db.query(query, [limit, offset])
    },
    find(id) {
        return db.query(`SELECT recipes.*, chefs.name AS autor FROM recipes 
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id) 
            WHERE recipes.id = $1`, [id])
    },
    update(data) {
        const query = `
            UPDATE recipes SET
                title=($1),
                ingredients=($2),
                preparation=($3),
                information=($4), 
                chef_id=($5)
                WHERE id = $6
                
        `

        const values = [
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.autor,
            data.id
        ]

        return db.query(query, values)
    },
    delete(id) {
        return db.query(`DELETE FROM recipes WHERE id = $1`, [id])
    }
}