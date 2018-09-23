'use strict';

const myki = require('./balance.js');

module.exports.getBalance = async (event, context) => {
	let auth = event.body;

	try {
		let balance = await myki.checkBalance(auth.username, auth.password);
		let messageBody = JSON.stringify({
			balance: balance
		});

		return {
			statusCode: 200,
			body: messageBody
		}

	} catch(e) {

		return {
			statusCode: 403,
			body: JSON.stringify({
				error: e.message
			})
		}
	}
}
