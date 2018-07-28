const express = require('express');
const bodyParser = require('body-parser');
const myki = require('./balance.js');

const app = express();
const jsonParser = bodyParser.json();

app.post('/myki/balance', jsonParser, function(req, res) {
	let auth = req.body

	var balance = myki.getBalance(auth.username, auth.password)
			  .then((result) => {
			  	res.json({'balance': result});
		      })
		      .catch((error) => {
		      	res.sendStatus(401).json({"error": "forbidden"});
		      });
})

app.post('/debug', jsonParser, function(req, res) {
	console.log(req.body);
	res.sendStatus(200);
})

app.listen(3000);

console.log('Express started on port 3000');
