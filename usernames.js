const validationUtils = require("byteballcore/validation_utils.js");

const wallets = require("./walletsModel.js");
const reservations = require("./reservationsModel.js");
const usernames = require("./usernamesModel.js");

const conf = require("byteballcore/conf");
const errors = conf.errors;

const format = require("string-template");

module.exports = {
	async createUsername({ username, wallet }) {
		if(!this.validateUsername(username))
			throw new Error(format(errors.INVALID_USERNAME, { username }));

		if(!this.validateWallet(wallet))
			throw new Error(format(errors.INVALID_WALLET, { wallet }));

		await usernames.save({ username, wallet });
	},

	async createReservation(reservation) {
		const { username, wallet, paymentAddress, paymentAmount } = reservation;

		if(!this.validateUsername(username))
			throw new Error(format(errors.INVALID_USERNAME, { username }));

		if(!this.validateWallet(wallet))
			throw new Error(format(errors.INVALID_WALLET, { wallet }));

		if(await this.findUsernameByWallet(wallet))
			throw new Error(format(errors.EXISTING_USERNAME, { username, wallet }));

		if(await this.findReservationByWallet(wallet))
			throw new Error(format(errors.EXISTING_RESERVATION, { wallet }));

		if(await this.findWalletByUsername(username))
			throw new Error(format(errors.USERNAME_TAKEN, { username, wallet }));

		if(await this.findReservationByUsername(username))
			throw new Error(format(errors.USERNAME_RESERVED, { username, wallet }));

		await reservations.save(reservation);
	},

	async createWallet({ device, wallet }) {
		if(!this.validateWallet(wallet))
			throw new Error(format(errors.INVALID_WALLET, { wallet }));

		if(!this.validateDevice(device))
			throw new Error(format(errors.INVALID_DEVICE, { device }));

		await wallets.save({ device, wallet });
	},

	async confirmReservationByWallet(wallet) {
		return await reservations.confirm(wallet);
	},

	async removeReservationByWallet(wallet) {
		return await reservations.remove(wallet);
	},

	async removeOutdatedReservations() {
		const currentDate = new Date();
		const limitDate = new Date(currentDate - conf.reservationTimeoutInSeconds * 1000);

		return await reservations.removeCreatedBefore(limitDate);
	},

	async findReservationsByUnits(units) {
		const result = await reservations.findByUnits(units);
		return (result && result.length) ? result[0] : null;
	},

	async findReservationByWallet(wallet) {
		const result = await reservations.find({ wallet });
		return (result && result.length) ? result[0] : null;
	},

	async findReservationByUsername(username) {
		const result = await reservations.find({ username });
		return (result && result.length) ? result[0] : null;
	},

	async findWalletByDevice(device) {
		const result = await wallets.find({ device });
		return (result && result.length) ? result[0].wallet : null;
	},

	async findUsernameByWallet(wallet) {
		const result = await usernames.find({ wallet });
		return (result && result.length) ? result[0].username : null;
	},

	async findWalletByUsername(username) {
		const result = await usernames.find({ username });
		return (result && result.length) ? result[0].wallet : null;
	},

	validateUsername(username) {
		if(!username.length || username.length < 5)
			return false;

		return true;
	},

	validateWallet(wallet) {
		return validationUtils.isValidAddress(wallet);
	},

	validateDevice(device) {
		return validationUtils.isValidDeviceAddress(device);
	},

	getPrice(username) {
		if(username.length < 7) {
			return module.exports.highPrice;
		} else {
			return module.exports.lowPrice;
		}
	}
}

module.exports.highPrice = conf.highPrice;
module.exports.lowPrice = conf.lowPrice;