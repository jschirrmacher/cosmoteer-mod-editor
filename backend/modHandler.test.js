/**
 * Created by Jasper on 15.07.2017.
 */
/*eslint-env mocha*/
const should = require('should') // eslint-disable-line no-unused-vars
const modHandler = require('./modHandler')


describe('Mod Handler', () => {
    it('Read Mod File reacts correctly to improper file', done => {
        should.not.exist(modHandler.readModFile('.Failure', '/Test Files/', true))
        done()
    })

    it('should read in sample mod with languages', done => {
        let result = modHandler.readModFile('S_Mod', '/Test Files/')
        result.ignore.languages.should.deepEqual([{id:'en', keywords: {}}])
        done()
    })
})
