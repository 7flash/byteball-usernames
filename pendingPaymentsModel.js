let pendingPayments = [];

module.exports = {
	findPayment({ username, address }) {
		if(username) {
			return pendingPayments.find((item) => item.username === username);
		} else {
			return pendingPayments.find((item) => item.address === address);
		}
	},

	removePayment({ username, address }) {
		let index = -1;

		if(username) {
			index = pendingPayments.findIndex((item) => item.username === username);
		} else {
			index = pendingPayments.findIndex((item) => item.address === address);
		}

		if(index > -1)
			pendingPayments.splice(index, 1);
	},

	savePayment(payment) {
		pendingPayments.push(payment);
	}
}