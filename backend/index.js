/**
 * Definition of index
 *
 * @author     joachim.schirrmacher@gmail.com
 */
'use strict'

const fs = require('fs')
const path = require('path')
const express = require('express')
const parser = require("./parseFile")
const glob = require("glob")

const app = express()

app.use((req, res, next) => {
    console.log(req.method + ' ' + req.path)
    next()
})

app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.header('Expires', '-1')
    res.header('Pragma', 'no-cache')
    res.charset = 'utf-8'
    next()
})

app.get('/mods', (req, res) => {
    glob('mods/*/mod.txt', (err, files) => { console.log(files); res.json({
        mods: files.map(file => {
            let data = parser.readFile(file)
            let id = file.replace(/mods\/(.*?)\/mod.txt/, '$1')
            return {
                id: id,
                title: data.Name,
                author: data.Author,
                version: data.Version,
                description: data.Description,
                logo: '/mods/' + id + '/media/' + data.Logo
            }
        })
    })})
})

app.get('/mods/:mod/media/:file', (req, res) => {
    var file = path.join(__dirname, 'mods', req.params.mod, req.params.file)
    if (fs.existsSync(file)) {
        res.sendFile(file)
    } else {
        res.sendFile(path.join(__dirname, 'plug.png'))
    }
})

app.listen(3001)
console.log('Server running')
