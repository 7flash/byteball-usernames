const executeQuery = require("./helpers.js").executeQuery;

const table = require("byteballcore/conf").usernamesTable;

module.exports = {
	async save({ username, wallet }) {
		await executeQuery(`INSERT INTO ${table} (username, wallet) VALUES(?, ?)`,
			[username, wallet]);
	},

	async find({ username, wallet }) {
		let result;

		if(username) {
			result = await executeQuery(`SELECT * FROM ${table} WHERE username = ?`,
				[username]);
		} else {
			result = await executeQuery(`SELECT * FROM ${table} WHERE wallet = ?`,
				[wallet]);
		}

		return result;
	}
}