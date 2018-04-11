let usernameOwnership = {};

const highPrice = 2000;
const lowPrice = 1000;

module.exports = {
	setUsernameOwner(username, person) {
		usernameOwnership[username] = person;
	},

	findUsernameOwner(username) {
		return usernameOwnership[username];
	},

	validateUsername(username) {
		if(!username.length || username.length < 5)
			return false;

		return true;
	},

	getPrice(username) {
		if(username.length < 7) {
			return module.exports.highPrice;
		} else {
			return module.exports.lowPrice;
		}
	},

	highPrice: highPrice,
	lowPrice: lowPrice
}