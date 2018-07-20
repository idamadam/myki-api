const express = require('express');

const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

const myki = require('./balance.js');

const app = express();

app.get('/myki/balance', function(req, res) {
	auth = JSON.parse(cryptr.decrypt(req.headers['x-authorisation']));
	
	console.log(auth.username + " " + auth.password);
	
	var balance = myki.getBalance(auth.username, auth.password)
			  .then((result) => {
			  	res.json({'balance': result});
		      })
		      .catch((error) => {
		      	res.sendStatus(401).json({"error": "forbidden"});
		      });
})

app.listen(3000);

console.log('Express started on port 3000');
