let usernameOwnership = {};

module.exports = {
	setOwner(username, person) {
		usernameOwnership[username] = person;
	},

	findOwner(username) {
		return usernameOwnership[username];
	}
}