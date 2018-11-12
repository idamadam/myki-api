'use strict';

const myki = require('./balance.js');

module.exports.getBalance = async (event, context) => {
	try {
		let auth = JSON.parse(event.body);

		let result = await myki.checkBalance(auth.username, auth.password);
		let messageBody = JSON.stringify(result);

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
