/*eslint-env mocha */
const should = require('should') // eslint-disable-line no-unused-vars
const parseFile = require('./parseFile')
const fs = require('fs')

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
        let result = parseFile.readNewFile('./Test Files/simple.txt', true)
        result.should.deepEqual({})
        done()
    })
    it('Structure Creator correctly creates base object for simple mod.txt', done =>{
        let result = parseFile.readNewFile('./Test Files/simpleMod.txt', true)
        result.should.deepEqual({author: 'Me', version: '1.0.0', name: 'Test'})
        done()
    })
    it('Structure Creator correctly handles arrays and objects', done =>{
        let result = parseFile.readNewFile('./Test Files/layers.txt', true)
        result.should.deepEqual({'':[{value:'Test'}, {value: 'Test 2'}, ['2'], {name: ['Test']}]})
        done()
    })

    it('should recognise definitions with continuation lines', done => {
        let result = parseFile.readNewFile('./Test Files/ContinuationLine.txt', true)
        result.should.deepEqual({description: 'A small test is very important!'})
        done()
    })

    it('Mod to Text Simple Test', done =>{
        let result = parseFile.toString({name: 'Bob', version: '1.0.0', author: 'Someone', description:'A simple test mod'})
        result.should.equal('name = "Bob"\nversion = "1.0.0"\nauthor = "Someone"\ndescription = "A simple test mod"\n')
        done()
    })

    it('Mod to Text of numbers', done =>{
        let result = parseFile.toString({int: 1, float: 2.3})
        result.should.equal('int = 1\nfloat = 2.3\n')
        done()
    })

    it('Mod to Text Complex Test', done => {
        let result = parseFile.toString({name: 'Better Engine', actions: ['Add 1', ['Add 4']],
            sampleStruct: {name: 'a sample', data: [3, {desc: 'deepDown', data: 3}] }})
        result.should.equal(fs.readFileSync('./Test Files/complex.txt').toString().replace(/\r/g, ''))
        done()
    })

    it('Parse inline newlines correctly', done => {
        let result = parseFile.readNewFile('./Test Files/newlineIncluded.txt')
        result[''].description.should.equal('This line\\n has a suprise!\\n Sorry two:( And a continuation\\n. Sorry')
        done()
    })

    it('Parser creates and writes file safely', done => {
        let result = parseFile.toString({description: 'this\n may \n fail'})
        result.should.equal('description = "this\\n may \\n fail"\n')
        done()
    })

    it('should add ignore object with toAdd array', done => {
        let result = parseFile.readNewFile('./Test Files/simple.txt')
        result.should.deepEqual({ignore: {}})
        done()
    })

    it('should find complete.txt to be complete', done => {
        let result = parseFile.readNewFile('./Test Files/complete.txt')
        result.should.deepEqual({stringsfolder : [], ignore: {} })
        done()
    })

    it('should find both languages present in directory', done => {
        let result = parseFile.getLanguages('./Test Files/Languages')
        result.should.deepEqual([{id: 'de', keywords: []},{id: 'en', keywords: []}])
        done()
    })
})

