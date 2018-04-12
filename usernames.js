const usernamesModel = require("./usernamesModel.js");
const pendingPaymentsModel = require("./pendingPaymentsModel.js");

const highPrice = 200;
const lowPrice = 100;

module.exports = {
	setUsernameOwner(username, person) {
		usernamesModel.setOwner(username, person);
	},

	findUsernameOwner(username) {
		return usernamesModel.findOwner(username);
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
		return pendingPaymentsModel.findPayment({ username });
	},

	findPendingPaymentByAddress(address) {
		return pendingPaymentsModel.findPayment({ address });
	},

	savePendingPayment(payment) {
		if(!this.validateUsername(payment.username))
			throw new Error(`${payment.username} is not valid`);

		if(this.findUsernameOwner(payment.username))
			throw new Error(`${payment.username} is already taken`);

		pendingPaymentsModel.savePayment(payment);
	},

	removePendingPaymentByUsername(username) {
		pendingPaymentsModel.removePayment({ username });
	},

	removePendingPaymentByAddress(address) {
		pendingPaymentsModel.removePayment({ address });
	}
}

module.exports.highPrice = highPrice;
module.exports.lowPrice = lowPrice;