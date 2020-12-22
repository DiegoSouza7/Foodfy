const db = require('../../config/db')

function find(filters, fields, orderby, table) {
	let query = `SELECT`

	if (fields) {
		query += ` ${fields},`

		query = `${query.slice(0, -1)} FROM ${table}`
	} else {
		query += ` * FROM ${table}`
	}

	if (filters) {
		Object.keys(filters).map(key => {
			query += ` ${key}`

			Object.keys(filters[key]).map(field => {
				query += ` ${field} = '${filters[key][field]}'`
			})
		})
	}

	if (orderby) {
		query += ` ORDER BY ${orderby}`
	}

	return db.query(query)
}

module.exports = {
	init({
		table
	}) {
		if (!table) throw new Error('Invalid Params')

		this.table = table

		return this
	},
	async findOne(filters, fields) {
		const results = await find(filters, fields, '', this.table)

		return results.rows[0]
	},
	async findAll(filters, fields, orderby) {
		const results = await find(filters, fields, orderby, this.table)

		return results.rows
	},
	async create(fields) {
		try {
			let keys = [],
				values = []

			Object.keys(fields).map(key => {
				keys.push(key)
				if ((key == 'ingredients') || (key == 'preparation')) {
					let IngredientOrPreparation = fields[key].map(item => item = `'${item}'`)

					values.push(`ARRAY [${IngredientOrPreparation}]`)
				} else {
					values.push(`'${fields[key]}'`)
				}
			})

			const query = `INSERT INTO ${this.table} (${keys.join(',')})
                VALUES (${values.join(',')})
                RETURNING id
            `
			const results = await db.query(query)
			return results.rows[0].id
		} catch (error) {
			console.error(error)
		}
	},
	update(id, fields) {
		try {
			let query = `UPDATE ${this.table} SET`

			Object.keys(fields).map(key => {
				if ((key == 'ingredients') || (key == 'preparation')) {
					let IngredientOrPreparation = fields[key].map(item => item = `'${item}'`)
					query = `${query} ${key} = ARRAY [${IngredientOrPreparation}],`
				} else {
					query = `${query} ${key} = '${fields[key]}',`
				}
			})
			query = `${query.slice(0, -1)} WHERE id = ${id}`

			return db.query(query)
		} catch (error) {
			console.error(error);

		}
	},
	delete(id) {
		return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id])
	}
}