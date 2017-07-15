const should = require('should')
const parseFile = require('./parseFile')

describe('File Parser', () => {
    it('Can Read Test File', done => {
        let result = parseFile.newParser("./Test Files/simple.txt")
        result.constructor.should.equal(Array)
        done()
    })
    it("Correctly parse comment", done => {
        let result = parseFile.newParser("./Test Files/simple.txt")
        result[0].type.should.equal("comment")
        result[0].matches[0].should.equal("//Test")
        done()
    })
    it("Structure Creator runs", done =>{
        let result = parseFile.readNewFile("./Test Files/simple.txt")
        result.should.deepEqual({})
        done()
    })
    it("Structure Creator correctly creates base object for simple mod.txt", done =>{
        let result = parseFile.readNewFile("./Test Files/simpleMod.txt")
        result.should.deepEqual({Author: "Me", Version: "1.0.0", Name: "Test"})
        done()
    })
    it("Structure Creator correctly handles arrays and objects", done =>{
        let result = parseFile.readNewFile("./Test Files/layers.txt")
        result.should.deepEqual([{Value:'Test'}, {Value: 'Test 2'}, ['2'], {Name: ["Test"]}])
        done()
    })
})

