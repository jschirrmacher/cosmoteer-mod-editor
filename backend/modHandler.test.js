/**
 * Created by Jasper on 15.07.2017.
 */
/*eslint-env mocha*/
const should = require('should') // eslint-disable-line no-unused-vars
const modHandler = require('./modHandler')


describe('Mod Handler', () => {
    it('Read Mod File reacts correctly to improper file', done => {
        let result = modHandler.readModFile('.Failure', 'Test Files', true)
        //noinspection BadExpressionStatementJS
        result.should.false
        done()
    })
})
