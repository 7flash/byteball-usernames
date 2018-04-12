const headlessWallet = require("headless-byteball");

const device = require("byteballcore/device");
const eventBus = require("byteballcore/event_bus");
const db = require("byteballcore/db");

const usernames = require("./usernames");

const welcomeMessage = "Here you can buy usernames";

if (process.env.debug != null) {
	require("readline").Interface.prototype.question = function(query, cb) {
		cb("");
	}
}

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

const handleTransaction = async (units) => {
	const query = `SELECT * FROM outputs WHERE outputs.unit IN(?)`;

	const rows = await executeQuery(query, [units]);

	for(output of rows) {
		const address = output.address;
		const amount = output.amount;

		const pendingPayment = usernames.findPendingPaymentByAddress(address);

		if(pendingPayment) {
			if(amount === pendingPayment.amount) {
				await usernames.setUsernameOwner(pendingPayment.username, pendingPayment.person);

				await usernames.removePendingPaymentByAddress(address);

				await reply(pendingPayment.person, `${pendingPayment.username} bought successfully`);
			} else {
				await reply(pendingPayment.person, `Your payment has been lost, sorry`);
			}
		}
	}
}

eventBus.on("paired", (from) => {
	reply(from, welcomeMessage);
});

eventBus.on("text", async (person, text) => {
	const username = text;

	const isValid = await usernames.validateUsername(username);
	if(!isValid) {
		return reply(person, `${username} is not valid`);
	}

	const existingOwner = await usernames.findUsernameOwner(username);
	if(existingOwner) {
		return reply(person, `${username} is taken by ${existingOwner}`);
	}

	const pendingPayment = await usernames.findPendingPaymentByUsername(username);
	if(pendingPayment) {
		return reply(person, `${username} is already pending for payment`);
	}

	const address = await createPaymentAddress();
	const amount = usernames.getPrice(username);

	await usernames.savePendingPayment({ address, amount, person, username });

	await reply(person, `[${username}](byteball:${address}?amount=${amount})`);
});

eventBus.on("new_my_transactions", handleTransaction);