/**
 * Definition of index
 *
 * @author     joachim.schirrmacher@gmail.com
 */
'use strict'

const express = require('express')
const modHandler = require('./modHandler')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const winston = require('winston')
const expressWinston = require('express-winston')

const app = express()

winston.level = process.env.LOG_LEVEL || 'info'
winston.remove(winston.transports.Console)
winston.add(winston.transports.Console, {timestamp:true})

app.enable('trust proxy')

app.use(expressWinston.logger({
    transports: [new winston.transports.Console({ timestamp: true })],
    meta: false
}))

app.use(fileUpload())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.header('Expires', '-1')
    res.header('Pragma', 'no-cache')
    res.charset = 'utf-8'
    next()
})

app.post('/mods', modHandler.createMod)
app.post('/mods/upload/picture/:mod', modHandler.uploadPicture)
app.post('/mods/mainModData/:mod/:id/:value', modHandler.changeMainModData)
app.post('/mods/:mod/parts/:type', modHandler.createPart)
app.post('/mods/:mod/updateLanguage', modHandler.editLanguage)
app.post('/mods/:mod/uploadPicture/:folder', modHandler.uploadPictures)

app.put('/mods/:mod', modHandler.updateMod)
app.put('/mods/:mod/parts/:type', modHandler.updatePart)

app.get('/mods', modHandler.listMods)
app.get('/mod/:mod', modHandler.getMod)
app.get('/mods/:mod/media/:file', modHandler.getMediaFile)
app.get('/mods/:mod/media/:dir/:file', modHandler.getMediaFile)
app.get('/mods/mainModData/:mod', modHandler.mainModData)
app.get('/mods/Languages/:mod', modHandler.getLanguageOverview)
app.get('/mods/:mod/shipLibrary/:folder', modHandler.getShipLibrary)
app.get('/mods/:mod/getPartInfo/:part', modHandler.getPart)
app.get('/mods/:mod/getAllParts', modHandler.getAllParts)

app.listen(3001)
winston.log('info', 'Server running')
winston.debug('Debug ouput is visible!')
