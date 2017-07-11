/**
 * Definition of index
 *
 * @author     joachim.schirrmacher@gmail.com
 */
'use strict'

const fs = require('fs')
const express = require('express')
const app = express()

app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.header('Expires', '-1')
    res.header('Pragma', 'no-cache')
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.charset = 'utf-8'
    next()
})

app.get('/mods', (req, res) => {
    fs.readdir('mods', (err, files) => res.json({mods: files.map((file, index) => ({id: index + 1, name: file}))}))
})

app.listen(3001)
console.log('Server running')
