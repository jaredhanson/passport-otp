var speakeasy = require('speakeasy');


function HotpAlgorithm() {
  
}

HotpAlgorithm.prototype.generate = function(cb) {
  console.log('GENERATE HOTP');
  
  var secret = speakeasy.generateSecret({ otpauth_url: false });
  console.log(secret);
  
  var otpauthURL = speakeasy.otpauthURL({
    type: 'hotp',
    counter: 0, // TODO: why isn't this working with speakeasy?
    secret: secret.ascii,
    issuer: 'Foo',
    label: 'test-at-test'
  })
  
  return cb(null, { secret: secret.ascii, barcodeURL: otpauthURL });
}

HotpAlgorithm.prototype.verify = function(authnr, otp, cb) {
  console.log('VERIFY HOTP');
  console.log(authnr);
  console.log(otp);
  // 621393
  
  var opts = { secret: authnr.secret, token: otp, counter: 0 };
  
  var delta = speakeasy.hotp.verifyDelta(opts);
  var verified = delta != null;
  
  console.log(verified);
  console.log(delta);
  
  //var opts = { secret: authnr.secret, token: otp };
  //var verified = speakeasy.totp.verify(opts);
  //return cb(null, verified);
  
  return cb(null, verified);
}


module.exports = HotpAlgorithm;
