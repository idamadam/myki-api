const rp = require('request-promise');

const username = 'idamadam';
const password = 'NqDv7Umz;6xjMp';

let auth = {
	'username': username,
	'password': password
}

let options = {
	method: 'POST',
	uri: 'http://localhost:3000/myki/balance',
	body: auth,
	json: true
}

rp(options)
.then((response) => {
	console.log(response);
})
.catch((e) => {console.log(e)});
