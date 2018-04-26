let reservations = [];

module.exports.find = async ({ wallet }) => {
	const result = reservations.find((item) => item.wallet === wallet);
	return result ? [result] : [];
};

module.exports.save = async (reservation) => {
	reservations.push(reservation);
};

module.exports.remove = async ({ wallet }) => {
	const index = reservations.findIndex((item) => item.wallet === wallet);

	if(index > -1)
		reservations.splice(index, 1);
};

module.exports.removeCreatedBefore = async (date) => {
	reservations.forEach((reservation, index) => {
		if(new Date(reservation.creation_date) < date) {
			reservations.splice(index, 1);
		}
	});
}