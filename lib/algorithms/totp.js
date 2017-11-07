var speakeasy = require('speakeasy');


function TotpAlgorithm() {
  
}

TotpAlgorithm.prototype.generate = function(cb) {
  console.log('GENERATE TOTP');
  
  var secret = speakeasy.generateSecret({ otpauth_url: false });
  console.log(secret);
  
  var otpauthURL = speakeasy.otpauthURL({
    type: 'totp',
    secret: secret.ascii,
    issuer: 'Foo',
    label: 'test-at-test'
  })
  
  return cb(null, { secret: secret.ascii, barcodeURL: otpauthURL });
}

TotpAlgorithm.prototype.verify = function(authnr, otp, cb) {
  var opts = { secret: authnr.secret, token: otp };
  var verified = speakeasy.totp.verify(opts);
  return cb(null, verified);
}


module.exports = TotpAlgorithm;
