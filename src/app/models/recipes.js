const db = require('../../config/db')
const Base = require('./Base')

Base.init({table: 'recipes'})
module.exports = {
	...Base,
	async paginate(params) {
		const {
			filter,
			id,
			orderby,
			limit,
			offset
		} = params

		let query = '',
			filterQuery = '',
			totalQuery = `(
                SELECT COUNT(*) FROM recipes
            ) AS total`,
			orderByQuery = '',
			ifID = ``

		if (id) {
			ifID = `OR chefs.user_id = '${id}'`
		}

		if (filter || id) {
			filterQuery = `
            WHERE recipes.title ILIKE '%${filter}%'
            OR chefs.name ILIKE '%${filter}%'
            ${ifID}
            `
			totalQuery = `(
                SELECT COUNT(*) FROM recipes LEFT JOIN chefs 
                ON (recipes.chef_id = chefs.id)
                ${filterQuery}
            ) AS total`
		}
		if (orderby) {
			orderByQuery = `ORDER BY ${orderby}`
		}

		query = `
        SELECT recipes.*, ${totalQuery}, chefs.user_id, chefs.name AS autor
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        ${filterQuery}
        GROUP BY (recipes.id, chefs.name, chefs.user_id) 
        ${orderByQuery}
        LIMIT ${limit} OFFSET ${offset}
        `

		const results = await db.query(query)

		return results.rows
	}
}