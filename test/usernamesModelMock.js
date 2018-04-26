let usernames = [];

module.exports.save = async ({ username, wallet }) => {
	usernames.push({ username, wallet });
};

module.exports.find = async ({ username, wallet }) => {
	if(username) {
		return usernames.find((item) => item.username === username);
	} else if(wallet) {
		return usernames.find((item) => item.wallet === wallet);
	}
}