/**
 * Module dependencies.
 */
var passport = require('passport-strategy')
  , util = require('util');


/**
 * `Strategy` constructor.
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {};
  }
  if (!verify) { throw new TypeError('MFAOTPStrategy requires a verify callback'); }
  
  this._otpField = options.usernameField || 'otp';
  
  passport.Strategy.call(this);
  this.name = 'mfa-otp';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  var otp = req.body[this._otpField];
  
  if (!otp) {
    return this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
  }
  
  var self = this;
  
  function verified(err, ok, info) {
    if (err) { return self.error(err); }
    if (!ok) { return self.fail(info); }
    
    info = info || {};
    info.method = info.method || 'otp';
    self.success(user, info);
  }
  
  try {
    if (self._passReqToCallback) {
      this._verify(req, req.user, otp, verified);
    } else {
      this._verify(req.user, otp, verified);
    }
  } catch (ex) {
    return self.error(ex);
  }
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
