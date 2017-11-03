/* global describe, it, expect */

var Strategy = require('../lib/strategy');
var Algorithms = require('../lib/algorithms');


describe('Strategy', function() {
  
  it('should be named otp', function() {
    var strategy = new Strategy(new Algorithms(), function(){});
    expect(strategy.name).to.equal('otp');
  });
  
  it('should throw if constructed with no arguments', function() {
    expect(function() {
      var s = new Strategy();
    }).to.throw(TypeError, 'OTPStrategy requires an algorithm registry');
  });
  
  it('should throw if constructed without an algorithm registry', function() {
    expect(function() {
      var s = new Strategy(function(){});
    }).to.throw(TypeError, 'OTPStrategy requires an algorithm registry');
  });
  
  it('should throw if constructed without a fetch callback', function() {
    expect(function() {
      var s = new Strategy(new Algorithms());
    }).to.throw(TypeError, 'OTPStrategy requires a fetch callback');
  });
  
});
