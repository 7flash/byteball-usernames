exports.deviceName = 'Usernames bot';
exports.permanent_pairing_secret = '0000';
exports.storage = 'sqlite';
exports.hub = 'byteball.org/bb';
exports.bLight = true;

exports.welcomeMessage = "Here you can buy usernames. Firstly, send me your wallet address";

exports.walletsTable = "device_to_wallet";
exports.reservationsTable = "wallet_to_reservation";
exports.usernamesTable = "wallet_to_username";

exports.highPrice = 200;
exports.lowPrice = 100;

exports.reservationTimeoutInSeconds = 3600;
exports.reservationsCheckIntervalInSeconds = 10;

exports.errors = {
	EXISTING_USERNAME: `You already have username "{username}" connected to your wallet "{wallet}"`,
	EXISTING_RESERVATION: `You already have reservation by "{wallet}"`,
	USERNAME_TAKEN: `"{username}" is taken by {wallet}`,
	USERNAME_RESERVED: `"{username}" is reserved by {wallet}`,
	INVALID_USERNAME: `"{username}" is not valid username - It should have at least 5 symbols length`,
	INVALID_WALLET: `"{wallet}" is not valid wallet address - Please choose correct one`,
	INVALID_DEVICE: `"{device}" is not valid device address`
};