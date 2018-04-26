const executeQuery = require("./helpers.js").executeQuery;

const table = require("byteballcore/conf.js").reservationsTable;

const timeout =

module.exports = {
	async find({ wallet }) {
		return await executeQuery(`SELECT * FROM ${table} WHERE wallet = ?`, [wallet]);
	},

	async save({ wallet, username, paymentAddress, paymentAmount }) {
		await executeQuery(`
			INSERT INTO ${table} 
				(wallet, username, payment_address, payment_amount)
				VALUES(?, ?, ?, ?)`,
			[wallet, username, paymentAddress, paymentAmount]);
	},

	async findByUnits(units) {
		const query = `SELECT * FROM outputs
				INNER JOIN ${table} ON (
					${table}.wallet = outputs.address
				AND
					${table}.payment_amount = outputs.amount
				)
			WHERE outputs.unit IN (?)
		`;

		return await executeQuery(query, [units]);
	},

	async removeCreatedBefore(date) {
		const query = `
			DELETE FROM ${table} WHERE
				is_confirmed = 0
			AND
				date(creation_date) < date(?)
		`;

		return await executeQuery(query, [date]);
	},

	async confirm(wallet) {
		await executeQuery(`
			UPDATE ${table} SET is_confirmed = 1
			WHERE wallet = ?
		`, [wallet]);
	},

	async remove(wallet) {
		await executeQuery(`DELETE FROM ${table} WHERE wallet = ?`, [wallet]);
	}
}