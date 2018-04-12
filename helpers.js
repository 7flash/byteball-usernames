const headlessWallet = require("headless-byteball");

const device = require("byteballcore/device");
const db = require("byteballcore/db");

const createPaymentAddress = () => {
	return new Promise((resolve) => {
		headlessWallet.issueNextMainAddress(resolve);
	});
}

const reply = (recipient, message) => {
	return new Promise((resolve) => {
		device.sendMessageToDevice(recipient, "text", message, {
			ifOk: () => {
				resolve();
			}
		});
	});
}

const executeQuery = async (query, params) => {
	return new Promise((resolve) => {
		db.query(query, params, resolve);
	});
}

module.exports = {
	createPaymentAddress,
	executeQuery,
	reply
};