const executeQuery = require("./helpers.js").executeQuery;

const table = "pending_payments";

module.exports = {
	async findPayment({ username, address }) {
		let result;

		if(username) {
			result = await executeQuery(`SELECT * FROM ${table} WHERE username = ?`, [username]);
		} else {
			result = await executeQuery(`SELECT * FROM ${table} WHERE address = ?`, [address]);
		}
	},

	async removePayment({ username, address }) {
		if(username) {
			await executeQuery(`DELETE FROM ${table} WHERE username = ?`, [username]);
		} else {
			await executeQuery(`DELETE FROM ${table} WHERE address = ?`, [address]);
		}
	},

	async savePayment(payment) {
		await executeQuery(`INSERT INTO ${table} (username, address, person, amount) VALUES(?)`,
			[payment.username, payment.address, payment.person, payment.amount]);
	}
}