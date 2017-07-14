'use strict'

const fs = require('fs')
const path = require('path')
const parser = require("./parseFile")
const glob = require('glob')
const stripJs = require('strip-js')

function readModFile(modId) {
    var fileName = path.join(__dirname, '/mods/', modId, '/mod.txt')
    let data = parser.readFile(fileName)
    return {
        id: modId,
        title: data.Name,
        author: data.Author,
        version: data.Version,
        description: stripJs(data.Description),
        logo: '/mods/' + modId + '/media/' + data.Logo
    }
}

module.exports = {
    listMods: (req, res) => {
        glob('mods/*/mod.txt', (err, files) => {
            res.json({
                mods: files.map(file => readModFile(file.replace(/mods\/(.*?)\/mod.txt/, '$1')))
            })
        })
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
        const dPath = path.join(__dirname, "mods", req.body.id)
        if(fs.existsSync(dPath)) {
            console.log("Project already exits!")
            res.json({error:"A mod with this ID already exists!"})
            return
        }
        fs.mkdirSync(dPath);
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
        const file = path.join(__dirname, "/mods/", req.body.id, "/mod.txt")
        fs.writeFile(file, txt, (err) => {
            if (err) console.log(err)
        })
        let newMod = parser.readFile(file);
        res.json(newMod)
    },

    uploadPicture: (req,res) => {
        if(req.busboy){
            req.busboy.on("file", (fieldName, fileStream, fileName, encoding, mimeType) =>{
                let newPath = path.join(__dirname, "mods", req.params.mod, fileName)
                fileStream.pipe(fs.createWriteStream(newPath))
                res.json("Sucess")
            })
            return req.pipe(req.busboy)
        }
    },

    updateMod: (req, res) => {
        let fileName = path.join(__dirname, "mods", req.params.mod, '/mod.txt')
        if (!fs.existsSync(fileName)) {
            res.json({error: 'Mod does not exist'})
        } else {
            let mod = fs.readFileSync(fileName).toString()
            mod = mod.replace(/Name\s*=\s*.*\n/i, 'Name="' + req.body.title + '"\n')
            mod = mod.replace(/Version\s*=\s*.*\n/i, 'Version="' + req.body.version + '"\n')
            mod = mod.replace(/Author\s*=\s*.*\n/i, 'Author="' + req.body.author + '"\n')
            fs.writeFile(fileName, mod, err => {
                if (err) {
                    res.json({error: err})
                } else {
                    res.json(readModFile(req.params.mod))
                }
            })
        }
    }
}
