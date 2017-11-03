/**
 * Module dependencies.
 */
var passport = require('passport-strategy')
  , util = require('util');


/**
 * `Strategy` constructor.
 *
 * @param {Object} options
 * @param {Function} fetch
 * @api public
 */
function Strategy(options, fetch) {
  if (typeof options == 'function') {
    fetch = options;
    options = {};
  }
  if (!fetch) { throw new TypeError('OTPStrategy requires a fetch callback'); }
  
  this._useridField = options.useridField || 'uid';
  this._otpField = options.otpField || 'otp';
  
  passport.Strategy.call(this);
  this.name = 'otp';
  this._fetch = fetch;
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
  var username = req.body[this._useridField];
  var otp = req.body[this._otpField];
  
  if (!otp) {
    return this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
  }
  
  var self = this;
  
  function verified(err, user, info) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(info); }
    
    info = info || {};
    info.method = info.method || 'otp';
    self.success(user, info);
  }
  
  try {
    if (self._passReqToCallback) {
      this._fetch(req, username, otp, verified);
    } else {
      this._fetch(username, otp, verified);
    }
  } catch (ex) {
    return self.error(ex);
  }
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
