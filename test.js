var should = require('should');
var nev = require('node-email-validator');

describe('Email validity check on the basis of MX records', function()
{
  describe('Valid email address', function()
  {
    it('should return true when email address is valid', function()
    {
      nev('sk.sayakkundu1997@gmail.com').then(
          result => result.isEmailValid.should.be.true && should.exist(result.mxRecords)
        )
        .catch(err => should.exist(err.errors));
    });
  });

  describe('Invalid email address', function()
  {
    it('should return false when email address is invalid', function()
    {
      nev('username@mail-server.extension').then(
        result => result.isEmailValid.should.not.exist)
        .catch(err => should.exist(err.errors));
    });
  });
});
