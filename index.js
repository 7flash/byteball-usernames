require("./enable_webstorm_debugger.js");

const eventBus = require("byteballcore/event_bus");
const usernames = require("./usernames");
const helpers = require("./helpers");
const reply = helpers.reply;

const welcomeMessage = "Here you can buy usernames";

let attestor = null;

const handleTransaction = async (units) => {
	const query = `SELECT * FROM outputs WHERE outputs.unit IN(?)`;

	const rows = await helpers.executeQuery(query, [units]);

	for(output of rows) {
		const address = output.address;
		const amount = output.amount;

		const pendingPayment = await usernames.findPendingPaymentByAddress(address);

		if(pendingPayment) {
			if(amount === pendingPayment.amount) {
				await usernames.setUsernameOwner(pendingPayment.username, pendingPayment.person);

				await usernames.removePendingPaymentByAddress(address);

				const unit = await helpers.postAttestation(attestor, {
					username: pendingPayment.username,
					person: pendingPayment.person
				});

				await reply(pendingPayment.person, `${pendingPayment.username} => https://explorer.byteball.org/#${unit}`);
			} else {
				await reply(pendingPayment.person, `Your payment has been lost, sorry`);
			}
		}
	}
}

eventBus.once('headless_wallet_ready', async () => {
	attestor = await helpers.createPaymentAddress();
});

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

	const address = await helpers.createPaymentAddress();
	const amount = usernames.getPrice(username);

	await usernames.savePendingPayment({ address, amount, person, username });

	await reply(person, `[${username}](byteball:${address}?amount=${amount})`);
});

eventBus.on("new_my_transactions", handleTransaction);