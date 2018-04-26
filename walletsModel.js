const executeQuery = require("./helpers.js").executeQuery;

const table = require("byteballcore/conf").walletsTable;

module.exports = {
	async save({ device, wallet }) {
		await executeQuery(`INSERT INTO ${table} (device, wallet) VALUES (?, ?)`,
			[device, wallet]);
	},

	async find({ device, wallet }) {
		let result;

		if(device) {
			result = await executeQuery(`SELECT * FROM ${table} WHERE device = ?`, [device]);
		} else {
			result = await executeQuery(`SELECT * FROM ${table} WHERE wallet = ?`, [wallet]);
		}

		return result[0];
	}
}