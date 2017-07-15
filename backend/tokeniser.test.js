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

    it('should recognise definitions', done => {
        let result = tokeniser('Name = Test\nAuthor = "Bob Sherman"', rules)
        result[0].type.should.equal("definition")
        result[1].type.should.equal("definition")
        result[0].matches[1].should.equal("Name")
        result[0].matches[2].should.equal("Test")
        result[1].matches[1].should.equal("Author")
        result[1].matches[2].should.equal('"Bob Sherman"')
        done()
    })
    it('should recognise definitions with continuation lines', done => {
        let result = tokeniser('Description = "A small test is"\\n"very important!"', rules)
        result[0].type.should.equal("definition")
        result[0].matches[1].should.equal("Description")
        result[0].matches[2].should.equal('"A small test is"\\n"very important!"')
        done()
    })

    it('should recognise arrays', done => {
        let result = tokeniser('abc [\n\tx = 1\n]', rules)
        result.should.be.an.array
        result.length.should.equal(3)
        result[0].type.should.equal('arrayStart')
        result[0].matches[0].should.equal('abc [')
        result[0].matches[1].should.equal('abc')
        result[2].type.should.equal('arrayEnd')
        result[2].matches[0].trim().should.equal(']')
        done()
    })

    it('should recognise objects', done => {
        let result = tokeniser('abc {\n\tx = 1\n}', rules)
        result.should.be.an.array
        result.length.should.equal(3)
        result[0].type.should.equal('objectStart')
        result[0].matches[0].should.equal('abc {')
        result[0].matches[1].should.equal('abc')
        result[2].type.should.equal('objectEnd')
        result[2].matches[0].trim().should.equal('}')
        done()
    })

    it('should recognise objects in an array')
    it('should recognise arrays in an array')

    it('should recognise literals in an array', done => {
        let result = tokeniser('abc [1, 2, 3]', rules)
        result.should.be.an.array
        result.length.should.equal(3)
        result[0].type.should.equal('arrayStart')
        result[0].matches[0].should.equal('abc [')
        result[0].matches[1].should.equal('abc')
        result[2].type.should.equal('arrayEnd')
        result[2].matches[0].trim().should.equal(']')
        done()
    })
})
