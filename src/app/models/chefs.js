const db = require('../../config/db')
const {date} = require('../../lib/utils')
const File = require('../models/File')
const fs = require('fs')


module.exports = {
    all() {
        db.query(`SELECT chefs.nome, COUNT(recipes) AS recipes
        FROM chefs LEFT JOIN recipes ON(recipes.chef_id = chefs.id)
        GROUP BY chefs.id`)
    },
    find(id) {
        return db.query(`SELECT chefs.*, files.path, COUNT(recipes) AS total FROM files
        LEFT JOIN chefs ON (files.id = chefs.file_id)
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        GROUP BY chefs.id, files.path`, [id])
    },
    findReceitasChef(id) {
        return db.query(`SELECT recipes.*, chefs.name AS autor 
        FROM recipes LEFT JOIN chefs 
        ON (recipes.chef_id = chefs.id)
        WHERE recipes.chef_id = $1`, [id])
    },
    create(data, fileId) {
        const query = `
            INSERT INTO chefs (
                name, 
                file_id, 
                updated_at
                ) VALUES ($1, $2, $3)
                RETURNING id
        `

        const values = [
            data.name,
            fileId,
            date(Date.now()).iso
        ]

        return db.query(query, values)
    },
    update(data) {
        const query = `
            UPDATE chefs SET
                name=($1)
                WHERE id = $2
                
        `
        const values = [
            data.name,
            data.id
        ]

        return db.query(query, values)
    },
    async delete(id) {
        let results = await db.query(`SELECT * FROM recipes WHERE chef_id = $1`, [id])
        let recipes = results.rows

        // pegar as imagens
        const allFiles = recipes.map(recipe => File.recipeFile(recipe.id))
        let promiseResults = await Promise.all(allFiles)

        const fileChef = this.find(id)
        const resultFileChef = (await fileChef).rows[0]


        await db.query(`DELETE FROM files WHERE id = $1`, [resultFileChef.file_id])
        fs.unlinkSync(resultFileChef.path)
        await db.query(`DELETE FROM chefs WHERE id = $1`, [id])

        promiseResults.map(results => {
            results.rows.map(file => {
                try {
                    db.query(`DELETE FROM files WHERE id = $1`, [file.file_id])
                    fs.unlinkSync(file.path)
                } catch(err) {
                    console.error(err)
                }

            })
        })

    },
    paginate(params) {
        const {filter, limit, offset} = params

        let query ='',
            filterQuery='',
            totalQuery=`
                COUNT(recipes)
            AS total`

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
        SELECT chefs.*, files.path, ${totalQuery}
        FROM chefs LEFT JOIN files ON (chefs.file_id = files.id)
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        ${filterQuery}
        GROUP BY chefs.id, files.path
        LIMIT $1 OFFSET $2
        `
        
        return db.query(query, [limit, offset])
    },
    chefs() {
        let query = ``
        
        query = `SELECT chefs.*, files.path, COUNT(recipes) AS total FROM files
        LEFT JOIN chefs ON (files.id = chefs.file_id)
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id, files.path`

        return db.query(query)
    }
}