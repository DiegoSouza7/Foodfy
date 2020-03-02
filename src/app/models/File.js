const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    create({filename, path}) {
        const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id
        `

        const values = [
            filename,
            path.replace(/\\/g, '/')
        ]
        
        return db.query(query, values)
    },
    async delete(id) {
        try {
            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            const file = result.rows[0]

            fs.unlinkSync(file.path)

            return db.query(`DELETE FROM files WHERE id = $1`, [id])
        }catch(err) {
            console.error(err)
        }
    },
    createConstraing(id, idFile) {
        const query = `INSERT INTO recipe_files (
            recipe_id, 
            file_id) 
            VALUES ($1, $2) 
            RETURNING id`

        return db.query(query, [id, idFile])
    },
    deleteConstraing(id) {
        return db.query(`DELETE FROM recipe_files WHERE recipe_id = $1`,[id])
    },
    recipeFile(id) {
        return db.query(`
        SELECT recipe_files.*, files.* 
        FROM recipe_files 
        LEFT JOIN files 
        ON (files.id = recipe_files.file_id)
        WHERE recipe_files.recipe_id = $1`, [id])
    }
}