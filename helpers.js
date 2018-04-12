const headlessWallet = require("headless-byteball");

const device = require("byteballcore/device");
const db = require("byteballcore/db");
const network = require("byteballcore/network");
const composer = require("byteballcore/composer");
const objectHash = require('byteballcore/object_hash.js');

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

const postAttestation = async (attestor, payload) => {
	return new Promise((resolve, reject) => {
		const message = {
			app: "attestation",
			payload_location: "inline",
			payload_hash: objectHash.getBase64Hash(payload),
			payload: payload
		};

		let params = {
			paying_addresses: [attestor],
			outputs: [{ address: attestor, amount: 0 }],
			messages: [message],
			signer: headlessWallet.signer,
			callbacks: composer.getSavingCallbacks({
				isNotEnoughFunds: reject,
				ifError: reject,
				ifOk: (joint) => {
					network.broadcastJoint(joint);
					resolve(joint.unit.unit);
				}
			})
		};

		const timestamp = Date.now();
		const dataFeed = { timestamp };
		const objTimestampMessage = {
			app: "data_feed",
			payload_location: "inline",
			payload_hash: objectHash.getBase64Hash(dataFeed),
			payload: dataFeed
		};
		params.messages.push(objTimestampMessage);

		composer.composeJoint(params);
	});
}


module.exports = {
	postAttestation,
	createPaymentAddress,
	executeQuery,
	reply,
};