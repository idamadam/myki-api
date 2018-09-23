'use strict';

const myki = require('./balance.js');

exports.getBalance = async (req, res) => {
	let auth = req.body;

	try {
		let balance = await myki.checkBalance(auth.username, auth.password);
		res.json({'balance': balance});
	} catch(e) {
		res.status(403).json({"error": e.message})
	}
}
