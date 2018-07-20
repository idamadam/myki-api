const express = require('express');

const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

const myki = require('./balance.js');

const app = express();

app.get('/myki/:username/:password', function(req,res){
	console.log(req.params.username + " " + req.params.password);
	
	let username = req.params.username;
	let password = req.params.password;
	
	var balance = myki.getBalance(username, password)
				  .then((result) => {
				  	res.send(result);
			      })
			      .catch((error) => {
			      	res.sendStatus(401);
			      });

});

app.get('/crypto/:username/:password', function(req, res) {
	let username = cryptr.decrypt(req.params.username);
	let password = cryptr.decrypt(req.params.password);
	
	console.log(req.params.username + " " + req.params.password);
	console.log(username + " " + password);
	
	var balance = myki.getBalance(username, password)
			  .then((result) => {
			  	res.json({'balance': result});
		      })
		      .catch((error) => {
		      	res.sendStatus(401).json({"error": "forbidden"});
		      });

});

app.get('/crypto', function(req, res) {
	auth = cryptr.decrypt(req.headers['x-authorisation'])
	
	console.log(auth);
	
	res.send(req.headers)
})

app.listen(3000);

console.log('Express started on port 3000');
