// Load modules.
var Strategy = require('./strategy');


// Expose Strategy.
exports = module.exports = Strategy;

// Exports.
exports.Strategy = Strategy;
exports.Algorithms = require('./algorithms');

exports.HotpAlgorithm = require('./algorithms/hotp');
exports.TotpAlgorithm = require('./algorithms/totp');
