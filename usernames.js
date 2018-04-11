let usernameOwnership = {};

module.exports = {
	setUsernameOwner(username, person) {
		usernameOwnership[username] = person;
	},

	findUsernameOwner(username) {
		return usernameOwnership[username];
	}
}