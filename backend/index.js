/**
 * Definition of index
 *
 * @author     joachim.schirrmacher@gmail.com
 */
'use strict'

const fs = require('fs')
const express = require('express')
const app = express()

app.get('/mods', (req, res) => {
    fs.readdir('mods', (err, files) => res.json(files))
})

app.listen(3001)
console.log('Server running')
