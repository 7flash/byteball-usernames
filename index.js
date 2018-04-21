require("./enable_webstorm_debugger.js");

const conf = require("byteballcore/conf");
const eventBus = require("byteballcore/event_bus");
const usernames = require("./usernames");
const helpers = require("./helpers");
const reply = helpers.reply;

const welcomeMessage = conf.welcomeMessage;

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

				let unit;

				try {
					unit = await helpers.postAttestation(attestor, {
						profile: pendingPayment.username,
						address: pendingPayment.person
					});

					await reply(pendingPayment.person, `${pendingPayment.username} => https://explorer.byteball.org/#${unit}`);
				} catch(e) {
					console.error(e);
					await reply(pendingPayment.person, `${pendingPayment.username} => without attestation`);
				}
			} else {
				await reply(pendingPayment.person, `Your payment has been lost, sorry`);
			}
		}
	}
}

eventBus.once('headless_wallet_ready', async () => {
	attestor = await helpers.createAddress();
	console.log(`Fill balance of attestor: ${attestor}`);
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