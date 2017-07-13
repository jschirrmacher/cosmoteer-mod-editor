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
    },

    createMod: (req,res) =>{
        console.log(req.body)
        if(fs.existsSync(path.join(__dirname, "mods", req.body.id))) {
            res.send("Already exists!")
            return
        }
        fs.mkdirSync(path.join(__dirname, "mods", req.body.id));
        //Create Text
        let txt = ""
        let rules = JSON.parse(fs.readFileSync("./templates/mod.json","utf8"))
        rules.forEach(line => {
            switch(line.typ){
                case "copy":
                    txt += line.text + "\n"
                    break
                case "combine":
                    if(line.quote){
                        txt += line.text + '\"' + req.body[line.value] + '\" \n'
                    } else{
                        txt += line.text + req.body[line.value] + "\n"
                    }
            }
        })
        //Create mod.txt
        fs.writeFile(path.join(__dirname, "/mods/", req.body.id, "/mod.txt"), txt, (err) => {
            if (err) console.log(err)
        })
        res.send("OK")
    }
}
