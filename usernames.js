let usernameOwnership = {};

let pendingPayments = {};

const highPrice = 200;
const lowPrice = 100;

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
			return highPrice;
		} else {
			return lowPrice;
		}
	},

	findPendingPayment(username) {
		return pendingPayments[username];
	},

	savePendingPayment(payment) {
		if(!this.validateUsername(payment.username))
			throw new Error(`${payment.username} is not valid`);

		if(this.findUsernameOwner(payment.username))
			throw new Error(`${payment.username} is already taken`);

		pendingPayments[payment.username] = payment;
	},

	highPrice: highPrice,
	lowPrice: lowPrice
}