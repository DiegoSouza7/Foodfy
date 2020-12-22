const db = require('../../config/db')
const Base = require('./Base')

Base.init({table: 'chefs'})

module.exports = {
	...Base,
	async paginate(params) {
		const {
			limit,
			offset
		} = params

		const query = `
        SELECT chefs.*, files.path, COUNT(recipes) AS total,
        (SELECT COUNT (*) FROM chefs) AS totalchefs
        FROM chefs LEFT JOIN files ON (chefs.file_id = files.id)
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id, files.path
        LIMIT ${limit} OFFSET ${offset}
        `

		const results = await db.query(query)

		return results.rows
	}
}