'use strict';

const myki = require('./balance.js');

exports.getBalance = async (req, res) => {
	let auth = req.body

	if (!auth.username || !auth.password) {
		return res.send('Please provide username and password');
	}

	myki.startSession(auth.username, auth.password)
		.then((result) => {
			return myki.checkBalance(result.browser, result.page)
		})
		.then((result) => {
			res.json({'balance': result});
		})
		.catch((error) => {
			console.log(error);
			if (error == "Login Details Incorrect") {
				res.status(403).json({"error": error})
			} else {
				res.status(503).json({"error": error})
			}
		});
}
