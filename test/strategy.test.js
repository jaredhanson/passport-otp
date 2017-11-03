/* global describe, it, expect */

var chai = require('chai');
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
  
  describe('handling an request with valid OTP', function() {
    var algorithms = new Algorithms();
    var algo = {
      verify: function(authnr, otp, cb) {
        if (authnr.id !== 'dev_324598') { return done(new Error('incorrect authnr argument')); }
        if (otp !== '432028') { return done(new Error('incorrect otp argument')); }
        return cb(null, true);
      }
    }
    algorithms.use('example', algo);
    
    var strategy = new Strategy(algorithms, function(uid, done) {
      if (uid !== '501') { return done(new Error('incorrect uid argument')); }
      
      var user = {
        id: '501',
        displayName: 'John Doe'
      };
      var authnr = {
        id: 'dev_324598',
        name: "Example Authenticator",
        algorithm: 'example'
      };
      return done(null, user, authnr);
    });
    
    var user, info;
    
    before(function(done) {
      chai.passport.use(strategy)
        .success(function(u, i) {
          user = u;
          info = i;
          done();
        })
        .req(function(req) {
          req.body = { uid: '501', otp: '432028' };
        })
        .authenticate();
    });
    
    it('should supply user', function() {
      expect(user).to.be.an.object;
      expect(user.id).to.equal('501');
    });
    
    it('should supply info', function() {
      expect(info).to.be.an.object;
      expect(info.method).to.equal('otp');
    });
  }); // handling an request with valid OTP
  
  describe('handling an request with valid OTP, using request', function() {
    var algorithms = new Algorithms();
    var algo = {
      verify: function(authnr, otp, cb) {
        if (authnr.id !== 'dev_324598') { return done(new Error('incorrect authnr argument')); }
        if (otp !== '432028') { return done(new Error('incorrect otp argument')); }
        return cb(null, true);
      }
    }
    algorithms.use('example', algo);
    
    var strategy = new Strategy({ passReqToCallback: true }, algorithms, function(req, uid, done) {
      if (req.headers['host'] !== 'acme.example.com') { return done(new Error('incorrect req argument')); }
      if (uid !== '501') { return done(new Error('incorrect uid argument')); }
      
      var user = {
        id: '501',
        displayName: 'John Doe'
      };
      var authnr = {
        id: 'dev_324598',
        name: "Example Authenticator",
        algorithm: 'example'
      };
      return done(null, user, authnr);
    });
    
    var user, info;
    
    before(function(done) {
      chai.passport.use(strategy)
        .success(function(u, i) {
          user = u;
          info = i;
          done();
        })
        .req(function(req) {
          req.headers['host'] = 'acme.example.com';
          req.body = { uid: '501', otp: '432028' };
        })
        .authenticate();
    });
    
    it('should supply user', function() {
      expect(user).to.be.an.object;
      expect(user.id).to.equal('501');
    });
    
    it('should supply info', function() {
      expect(info).to.be.an.object;
      expect(info.method).to.equal('otp');
    });
  }); // handling an request with valid OTP, using request
  
  describe('handling an request with invalid OTP', function() {
    var algorithms = new Algorithms();
    var algo = {
      verify: function(authnr, otp, cb) {
        if (authnr.id !== 'dev_324598') { return done(new Error('incorrect authnr argument')); }
        if (otp !== '432028') { return done(new Error('incorrect otp argument')); }
        return cb(null, false);
      }
    }
    algorithms.use('example', algo);
    
    var strategy = new Strategy(algorithms, function(uid, done) {
      if (uid !== '501') { return done(new Error('incorrect uid argument')); }
      
      var user = {
        id: '501',
        displayName: 'John Doe'
      };
      var authnr = {
        id: 'dev_324598',
        name: "Example Authenticator",
        algorithm: 'example'
      };
      return done(null, user, authnr);
    });
    
    var info;
    
    before(function(done) {
      chai.passport.use(strategy)
        .fail(function(i) {
          info = i;
          done();
        })
        .req(function(req) {
          req.body = { uid: '501', otp: '432028' };
        })
        .authenticate();
    });
    
    it('should not supply info', function() {
      expect(info).to.be.undefined;
    });
  }); // handling an request with invalid OTP
  
});
