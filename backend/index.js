/**
 * Definition of index
 *
 * @author     joachim.schirrmacher@gmail.com
 */
'use strict'

const fs = require('fs')
const express = require('express')
const parser = require("./parseFile")
const glob = require("glob")

const app = express()

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
            return {
                id: file,
                title: data.Name,
                author: data.Author,
                version: data.Version,
                description: data.Description
            }
        })
    })})
})

app.listen(3001)
console.log('Server running')
