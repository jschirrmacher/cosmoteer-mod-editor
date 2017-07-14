/**
 * Definition of index
 *
 * @author     joachim.schirrmacher@gmail.com
 */
'use strict'

const express = require('express')
const modHandler = require('./modHandler')
const bodyParser = require("body-parser")
const busboy = require("connect-busboy")

const app = express()

app.use((req, res, next) => {
    console.log(req.method + ' ' + req.path)
    next()
})

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

app.post("/mods", modHandler.createMod)
app.post("/mods/upload/picture/:mod", modHandler.uploadPicture)

app.put('/mods/:mod', modHandler.updateMod)

app.get('/mods', modHandler.listMods)
app.get('/mods/:mod/media/:file', modHandler.getMediaFile)

app.listen(3001)
console.log('Server running')
