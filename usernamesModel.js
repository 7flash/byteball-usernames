const executeQuery = require("./helpers.js").executeQuery;

const table = require("byteballcore/conf").usernamesTable;

module.exports = {
	async setOwner(username, person) {
		await executeQuery(`INSERT INTO ${table} (username, person) VALUES(?, ?)`,
			[username, person]);
	},

	async findOwner(username) {
		const result = await executeQuery(`SELECT person FROM ${table} WHERE username = ?`,
			[username]);

		return result[0];
	}
}