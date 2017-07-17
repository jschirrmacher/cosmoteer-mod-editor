/**
 * Definition of index
 *
 * @author     joachim.schirrmacher@gmail.com
 */
'use strict'

const express = require('express')
const modHandler = require('./modHandler')
const bodyParser = require('body-parser')
const busboy = require('connect-busboy')
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

app.use(busboy())
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

app.put('/mods/:mod', modHandler.updateMod)

app.post('/mods/:mod/parts/:type', modHandler.createPart)
app.put('/mods/:mod/parts/:type', modHandler.updatePart)

app.get('/mods', modHandler.listMods)
app.get('/mods/:mod/media/:file', modHandler.getMediaFile)
app.get('/mods/mainModData/:mod', modHandler.mainModData)

app.listen(3001)
winston.log('info', 'Server running')
