function Algorithms() {
  this._algos = {};
}

Algorithms.prototype.use = function(type, algo) {
  this._algos[type] = algo;
};

Algorithms.prototype.generate = function(type, cb) {
  var algo = this._algos[type];
  if (!algo) { return cb(new Error('OTP algorithm "' + type + '" is not supported')); }
  
  return algo.generate(cb);
};

Algorithms.prototype.verify = function(authnr, otp, cb) {
  var algo = this._algos[authnr.algorithm];
  if (!algo) { return cb(new Error('OTP algorithm "' + authnr.algorithm + '" is not supported')); }
  
  return algo.verify(authnr, otp, cb);
};


module.exports = Algorithms;
