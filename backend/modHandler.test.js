/**
 * Created by Jasper on 15.07.2017.
 */
/*eslint-env mocha*/
const should = require('should') // eslint-disable-line no-unused-vars
const modHandler = require('./modHandler')
const parser = require('./parseFile')
const path = require('path')


describe('Mod Handler', () => {
    it('Read Mod File reacts correctly to improper file', done => {
        let result = modHandler.readModFile('.Failure', 'Test Files', true)
        //noinspection BadExpressionStatementJS
        result.should.false
        done()
    })
})

describe('Parser and Mod Handler File Handling', () => {
    it('Parser creates and writes file safely', done =>{
        //Save file with newline
        parser.writeToFile(parser.fromObjectToText({description: 'this\n may \n fail'}), path.join(__dirname, 'Test Files', '.Safe', 'mod.txt'))
        //Load
        let result = modHandler.readModFile('.Safe', 'Test Files', true)
        result.description.should.equal('this\\n may \\n fail')
        done()
    })
})
