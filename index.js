const headlessWallet = require("headless-byteball");

const device = require("byteballcore/device");
const eventBus = require("byteballcore/event_bus");
const db = require("byteballcore/db");

const usernames = require("./usernames");

const welcomeMessage = "Here you can buy usernames";

eventBus.on("paired", (from) => {
	reply(from, welcomeMessage);
});

eventBus.on("text", async (person, text) => {
	const username = text;

	const owner = await usernames.findUsernameOwner(username);

	if(typeof owner === "undefined") {
		usernames.setUsernameOwner(username, person);
		await reply(person, `${username} bought successfully`);
	} else {
		await reply(person, `${username} is taken by ${owner}`);
	}
});

const reply = (recipient, message) => {
	return new Promise((resolve) => {
		device.sendMessageToDevice(recipient, "text", message, {
			ifOk: () => {
				resolve();
			}
		});
	});
}