const db = require('../../config/db')

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
                chef_id
                ) VALUES ($1, $2, $3, $4, $5)
                RETURNING id
        `

        // data.ingredients = typeof data.ingredients == "string" ? [data.ingredients] : data.ingredients
        // data.preparation = typeof data.preparation == "string" ? [data.preparation] : data.preparation

        if (typeof data.ingredients == "string") data.ingredients = [data.ingredients]
        if (typeof data.preparation == "string") data.preparation = [data.preparation]


        const values = [
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.autor
        ]

        return db.query(query, values)
    },
    chefSelectOptions(id) {
        let query = `SELECT name, id FROM chefs`
        if(id) {
            query = `${query} WHERE chefs.user_id = ${id}`
        }

        return db.query(query)
    },
    paginate(params) {
        const {filter, id, limit, offset } = params

        let query ='',
            filterQuery='',
            totalQuery=`(
                SELECT COUNT(*) FROM recipes
            ) AS total`        

        if (filter || id) {
            filterQuery = `
            WHERE recipes.title ILIKE '%${filter}%'
            OR chefs.name ILIKE '%${filter}%'
            OR chefs.user_id = '${id}'
            `
            totalQuery = `(
                SELECT COUNT(*) FROM recipes LEFT JOIN chefs 
                ON (recipes.chef_id = chefs.id)
                ${filterQuery}
            ) AS total`
        }

        query = `
        SELECT recipes.*, ${totalQuery}, chefs.user_id, chefs.name AS autor
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        ${filterQuery}
        GROUP BY (recipes.id, chefs.name, chefs.user_id) 
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