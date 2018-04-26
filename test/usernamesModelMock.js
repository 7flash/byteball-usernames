let usernames = [];

module.exports.save = async ({ username, wallet }) => {
	usernames.push({ username, wallet });
};

module.exports.find = async ({ username, wallet }) => {
	let result;

	if(username) {
		result = usernames.find((item) => item.username === username);
	} else if(wallet) {
		result = usernames.find((item) => item.wallet === wallet);
	}

	return result ? [result] : [];
}