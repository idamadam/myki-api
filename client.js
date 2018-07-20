const rp = require('request-promise');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

const username = 'idamadam';
const password = 'NqDv7Umz;6xjMp';

let cryptoUser = cryptr.encrypt(username);
let cryptoPword = cryptr.encrypt(password);

let auth = {
	'username': username,
	'password': password
}

let cryptAuth = cryptr.encrypt(JSON.stringify(auth));

let options = {
	uri: 'http://localhost:3000/crypto/',
	headers : {
		'x-Username': cryptoUser,
		'x-Password': cryptoPword,
		'x-Authorisation': cryptAuth
	},
	json: true
}

rp(options)
.then((response) => {
	console.log(response);
})
.catch((e) => {console.log(e)});

/*
rp(`http://localhost:3000/crypto/${cryptoUser}/${cryptoPword}`)
.then((response) => {
	console.log(response);
})
.catch((e) => {console.log(e)});

rp(`http://localhost:3000/myki/${username}/${password}`)
.then((response) => {
	console.log(response);
})
.catch((e) => {console.log(e)});
*/