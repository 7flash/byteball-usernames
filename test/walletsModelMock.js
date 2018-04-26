let wallets = [];

module.exports.save = async ({ device, wallet }) => {
	wallets.push({ device, wallet });
};

module.exports.find = async ({ device, wallet }) => {
	if(device) {
		return wallets.find((item) => item.device === device);
	} else if (wallet) {
		return wallets.find((item) => item.wallet === wallet);
	}
};