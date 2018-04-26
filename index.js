require("./enable_webstorm_debugger.js");

const interval = require("interval-promise");

const conf = require("byteballcore/conf");
const eventBus = require("byteballcore/event_bus");
const usernames = require("./usernames");
const helpers = require("./helpers");
const reply = helpers.reply;

const welcomeMessage = conf.welcomeMessage;

let attestor = null;

const onReady = async () => {
	attestor = await helpers.createAddress();
	console.log(`Fill balance of attestor: ${attestor}`);

	interval(checkReservations, conf.reservationsCheckIntervalInSeconds * 1000);
};

const onPaired = async (from) => {
	await reply(from, welcomeMessage);
};

const handleNewTransactions = async (units) => {
	const reservations = await usernames.findReservationsByUnits(units);

	if(reservations) {
		reservations.map(async ({wallet}) => {
			await reservation.confirmReservationByWallet(wallet);
		});
	}
};

const handleStableTransactions = async (units) => {
	const reservations = await usernames.findReservationsByUnits(units);

	if(reservations) {
		reservations.map(async ({username, wallet}) => {
			await usernames.createUsername({username, wallet});

			await usernames.removeReservationByWallet(wallet);

			await helpers.postAttestation(attestor, {
				profile: username,
				address: wallet
			});
		});
	}
};

const handleQuestion = async (device, text) => {
	device = device.trim();

	const wallet = await usernames.findWalletByDevice(device);

	if (wallet) {
		const chosenUsername = text.trim();

		try {
			const address = await helpers.createAddress();

			const amount = usernames.getPrice(chosenUsername);

			await usernames.createReservation({
				wallet: wallet,
				username: chosenUsername,
				paymentAddress: address,
				paymentAmount: amount
			});

			await reply(device, `[${chosenUsername}](byteball:${address}?amount=${amount})`);
		} catch(e) {
			await reply(device, e.toString());
		}
	} else {
		const chosenWallet = text.trim();

		try {
			await usernames.createWallet({
				device: device,
				wallet: chosenWallet
			});

			await reply(device, `Your device "${device}" has been connected to ${chosenWallet}`);
		} catch(e) {
			return await reply(device, e.toString());
		}
	}
};

const checkReservations = async () => {
	await usernames.removeOutdatedReservations();
};

eventBus.once("headless_wallet_ready", onReady);
eventBus.on("paired", onPaired);
eventBus.on("text", handleQuestion);
eventBus.on("new_my_transactions", handleNewTransactions);
eventBus.on("my_transactions_became_stable", handleStableTransactions);