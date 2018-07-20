const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
 
const encryptedString = cryptr.encrypt('bacon');
const decryptedString = cryptr.decrypt(encryptedString);
 
console.log(encryptedString); // 5590fd6409be2494de0226f5d7
console.log(decryptedString); // bacon