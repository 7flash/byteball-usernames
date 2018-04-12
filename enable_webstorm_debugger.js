if (process.env.debug != null) {
	require("readline").Interface.prototype.question = function(query, cb) {
		cb("");
	}
}