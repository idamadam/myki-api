'use strict';

const myki = require('./balance.js');

exports.getBalance = async (req, res) => {
	let auth = req.body;

	try {
		let balance = await fastMyki.checkBalance(auth.username, auth.password);
		res.json({'balance': balance});
	} catch(e) {
		res.status(403).json({"error": e.message})
	}
}
