/*eslint-env mocha */
const should = require('should') // eslint-disable-line no-unused-vars
const parseFile = require('./parseFile')

describe('File Parser', () => {
    it('Can Read Test File', done => {
        let result = parseFile.newParser('./Test Files/simple.txt')
        result.constructor.should.equal(Array)
        done()
    })
    it('Correctly parse comment', done => {
        let result = parseFile.newParser('./Test Files/simple.txt')
        result[0].type.should.equal('comment')
        result[0].matches[0].should.equal('//Test')
        done()
    })
    it('Structure Creator runs', done =>{
        let result = parseFile.readNewFile('./Test Files/simple.txt')
        result.should.deepEqual({})
        done()
    })
    it('Structure Creator correctly creates base object for simple mod.txt', done =>{
        let result = parseFile.readNewFile('./Test Files/simpleMod.txt')
        result.should.deepEqual({author: 'Me', version: '1.0.0', name: 'Test'})
        done()
    })
    it('Structure Creator correctly handles arrays and objects', done =>{
        let result = parseFile.readNewFile('./Test Files/layers.txt')
        result.should.deepEqual([{value:'Test'}, {value: 'Test 2'}, ['2'], {name: ['Test']}])
        done()
    })

    it('should recognise definitions with continuation lines', done => {
        let result = parseFile.readNewFile('./Test Files/ContinuationLine.txt')
        result.should.deepEqual({description: 'A small test is very important!'})
        done()
    })

    it('Mod to Text Simple Test', done =>{
        let result = parseFile.fromObjectToText({name: "Bob", version: "1.0.0", author: "Someone", description:"A simple test mod"})
        result.should.deepEqual(['name = "Bob"', 'version = "1.0.0"', 'author = "Someone"', 'description = "A simple test mod"'])
        done()
    })
})

