const should = require('should')
const tokeniser = require('./tokeniser')
const rules = require('./rules')

describe('Tokeniser', () => {
    it('should recognise comments', done => {
        let result = tokeniser('// abc', rules)
        result.should.be.an.array
        result.length.should.equal(1)
        result[0].type.should.equal('comment')
        result[0].matches[0].should.equal('// abc')
        done()
    })

    it('should recognise definitions')
    it('should recognise definitions with continuation lines')
    it('should recognise arrays')
    it('should recognise objects')
    it('should recognise objects in an array')
    it('should recognise arrays in an array')
    it('should recognise literals in an array')
})
