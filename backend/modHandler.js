'use strict'

const fs = require('fs')
const path = require('path')
const parser = require("./parseFile")
const glob = require('glob')
const stripJs = require('strip-js')

module.exports = {
    listMods: (req, res) => {
        glob('mods/*/mod.txt', (err, files) => { console.log(files); res.json({
            mods: files.map(file => {
                let data = parser.readFile(file)
                let id = file.replace(/mods\/(.*?)\/mod.txt/, '$1')
                return {
                    id: id,
                    title: data.Name,
                    author: data.Author,
                    version: data.Version,
                    description: stripJs(data.Description),
                    logo: '/mods/' + id + '/media/' + data.Logo
                }
            })
        })})
    },
    getMediaFile: (req, res) => {
        var file = path.join(__dirname, 'mods', req.params.mod, req.params.file)
        if (fs.existsSync(file)) {
            res.sendFile(file)
        } else {
            res.sendFile(path.join(__dirname, 'plug.png'))
        }
    }
}
