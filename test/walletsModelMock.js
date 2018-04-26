let wallets = [];

module.exports.save = async ({ device, wallet }) => {
	wallets.push({ device, wallet });
};

module.exports.find = async ({ device, wallet }) => {
	let result;

	if(device) {
		result = wallets.find((item) => item.device === device);
	} else if (wallet) {
		result = wallets.find((item) => item.wallet === wallet);
	}

	return result ? [result] : [];
};