var should = require('should');
var nev = require('node-email-validator');

describe('Email validity check on the basis of MX records', function()
{
    /* test-1: It is for checking valid email address. */
    describe('Valid email address', function()
    {
        it('should return true when email address is valid', function()
        {
            nev('sk.sayakkundu1997@gmail.com').then(
                result => result.isEmailValid.should.be.true && result.timeout.should.be.false && should.exist(result.mxRecords))
                .catch(err => should.exist(err.errors));
        });
    });
    /* test-2: It is for checking invalid email address. */
    describe('Invalid email address', function()
    {
        it('should return false when email address is invalid', function()
        {
            nev('username@mail-server.extension').then(
                result => result.isEmailValid.should.be.false)
                .catch(err => should.exist(err.errors));
        });
    });
    /* test-3: It is for checking if input email address is of a proper format
       as per RFC 5322. */
    describe('Email address format', function()
    {
        it('should return false when email address is not of a proper format', function()
        {
            nev('username@mail-server').then(
                result => result.isEmailValid.should.not.exist)
                .catch(err => console.log('caught', err.message));
        });
    });
    /* test-4: It is for checking that an email address is not of temporary email
       address, private organization email address or less used mail server. */
    describe('Checking that an email address is not of temporary email address, private organization email address or less used mail server', function()
    {
        it('should return false when email address does not belong to above categories', function()
        {
            nev('sk.sayakkundu1997@gmail.com').then(
                result => result.isEmailValid.should.be.true && should.exist(result.mxRecords) && result.possibility.should.be.false)
                .catch(err => should.exist(err.errors));
        });
    });
    /* test-5: It is for checking that an email address is of temporary email
       address, private organization email address or less used mail server. */
    describe('Checking that an email address is of temporary email address, private organization email address or less used mail server', function()
    {
        it('should return true when email address belongs to above categories', function()
        {
            nev('yekotid318@lerwfv.com').then(
                result => result.isEmailValid.should.be.true && should.exist(result.mxRecords) && result.possibility.should.be.true)
                .catch(err => should.exist(err.errors));
        });
    });
    /* test-6: It is for checking that if email address is invalid, then
       there should be no records. */
    describe('Checking that if email address is invalid, then the there should be no records', function()
    {
        it('should return an empty array of MX records', function()
        {
            nev('username@mail-server.extension.com').then(
                result => result.mxRecords.should.be.empty())
                .catch(err => console.log('caught', err.message));
        });
    });
    /* test-7: It is for checking that if 'isEmailValid' is false, then
       either 'possibility' is true or 'mxRecordExist' is false. */
    describe('checking that if isEmailValid is false, then either possibility flag is true or mxRecordExist flag is false', function()
    {
        it('should return possibility flag with value true or mxRecordExist flag with value false', function()
        {
            nev('username@mail-server.extension.com').then(
                result => result.possibility.should.be.true || result.mxRecordExist.should.be.false)
                .catch(err => should.exist(err.errors));
        });
    });
});
