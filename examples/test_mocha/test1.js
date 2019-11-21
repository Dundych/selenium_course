var assert = require('assert');
describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});

describe('a suite of tests', function () {
    this.timeout(500);

    it('should take less than 500ms', function (done) {
        setTimeout(done, 300);
    });

    it('should take less than 500ms as well', function (done) {
        setTimeout(done, 250);
    });
});

describe('Chai', function () {

    it('Assert', function () {
        var assert = require('chai').assert
            , foo = 'bar'
            , beverages = { tea: ['chai', 'matcha', 'oolong'] };

        assert.typeOf(foo, 'string'); // without optional message
        assert.typeOf(foo, 'string', 'foo is a string'); // with optional message
        assert.equal(foo, 'bar', 'foo equal `bar`');
        assert.lengthOf(foo, 3, 'foo`s value has a length of 3');
        assert.lengthOf(beverages.tea, 3, 'beverages has 3 types of tea');
    });

    it('Expect', function () {
        var expect = require('chai').expect
            , foo = 'bar'
            , beverages = { tea: ['chai', 'matcha', 'oolong'] };

        expect(foo).to.be.a('string');
        expect(foo).to.equal('bar');
        expect(foo).to.have.lengthOf(3);
        expect(beverages).to.have.property('tea').with.lengthOf(3);
    });

    it('Should', function () {
        var should = require('chai').should() //actually call the function
            , foo = 'bar'
            , beverages = { tea: ['chai', 'matcha', 'oolong'] };

        foo.should.be.a('string');
        foo.should.equal('bar');
        foo.should.have.lengthOf(3);
        beverages.should.have.property('tea').with.lengthOf(3);
    });

});
