var speakeasy = require('speakeasy');


function TotpAlgorithm() {
  
}

TotpAlgorithm.prototype.generate = function(cb) {
  console.log('GENERATE TOTP');
  
  var secret = speakeasy.generateSecret();
  console.log(secret);
}

TotpAlgorithm.prototype.verify = function() {
  
}


module.exports = TotpAlgorithm;
