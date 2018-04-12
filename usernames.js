let usernameOwnership = {};

let pendingPayments = [];

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

	findPendingPaymentByUsername(username) {
		return pendingPayments.find((item) => item.username === username);
	},

	findPendingPaymentByAddress(address) {
		return pendingPayments.find((item) => item.address === address);
	},

	savePendingPayment(payment) {
		if(!this.validateUsername(payment.username))
			throw new Error(`${payment.username} is not valid`);

		if(this.findUsernameOwner(payment.username))
			throw new Error(`${payment.username} is already taken`);

		pendingPayments.push(payment);
	},

	removePendingPaymentByUsername(username) {
		const index = pendingPayments.findIndex((item) => item.username === username);

		if(index > -1)
			pendingPayments.splice(index, 1);
	},

	removePendingPaymentByAddress(address) {
		const index = pendingPayments.findIndex((item) => item.address === address);

		if(index > -1)
			pendingPayments.splice(index, 1);
	}
}

module.exports.highPrice = highPrice;
module.exports.lowPrice = lowPrice;