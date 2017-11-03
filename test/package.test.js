/* global describe, it */

var strategy = require('..');
var expect = require('chai').expect;


describe('passport-otp', function() {
  
  it('should export Strategy constructor directly from package', function() {
    expect(strategy).to.be.a('function');
    expect(strategy).to.equal(strategy.Strategy);
  });
  
});
