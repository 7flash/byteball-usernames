const usernamesModel = require("./usernamesModel.js");
const pendingPaymentsModel = require("./pendingPaymentsModel.js");

module.exports = {
	async setUsernameOwner(username, person) {
		await usernamesModel.setOwner(username, person);
	},

	async findUsernameOwner(username) {
		return await usernamesModel.findOwner(username);
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

	async findPendingPaymentByUsername(username) {
		return await pendingPaymentsModel.findPayment({ username });
	},

	async findPendingPaymentByAddress(address) {
		return await pendingPaymentsModel.findPayment({ address });
	},

	async savePendingPayment(payment) {
		if(!this.validateUsername(payment.username))
			throw new Error(`${payment.username} is not valid`);

		if(await this.findUsernameOwner(payment.username))
			throw new Error(`${payment.username} is already taken`);

		await pendingPaymentsModel.savePayment(payment);
	},

	async removePendingPaymentByUsername(username) {
		await pendingPaymentsModel.removePayment({ username });
	},

	async removePendingPaymentByAddress(address) {
		await pendingPaymentsModel.removePayment({ address });
	}
}

module.exports.highPrice = 200;
module.exports.lowPrice = 100;