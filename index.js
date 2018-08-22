const express = require('express');
const bodyParser = require('body-parser');
const myki = require('./balance.js');

const app = express();
const jsonParser = bodyParser.json();

let debugResponse = {
	response: "hello"
}

app.post('/myki/balance', jsonParser, function(req, res) {
	let auth = req.body;

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
})

app.post('/debug', jsonParser, function(req, res) {
	console.log("Debug Request")
	console.log(req.body);
	res.send(JSON.stringify(debugResponse));
})

app.listen(3000);

console.log('Express started on port 3000');
