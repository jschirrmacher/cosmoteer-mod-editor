'use strict'

const fs = require('fs')
const path = require('path')
const parser = require("./parseFile")
const glob = require('glob')
const stripJs = require('strip-js')

function readModFile(modId) {
    var fileName = path.join(__dirname, '/mods/', modId, '/mod.txt')
    let data = parser.readNewFile(fileName)
    return {
        id: modId,
        name: data.Name,
        author: data.Author,
        version: data.Version,
        description: stripJs(data.Description),
        logo: '/mods/' + modId + '/media/' + data.Logo
    }
}

let mod

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

    createMod: (req,res) => {
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
        fs.writeFile(file, txt, err => {
            if (err) {
                res.json({error: err})
            } else {
                res.json(readModFile(req.body.id))
            }
        })
    },

    uploadPicture: (req,res) => {
        if(req.busboy){
            req.busboy.on("file", (fieldName, fileStream, fileName) =>{
                //Save picture
                const modName = req.params.mod
                let newPath = path.join(__dirname, "mods", modName, fileName)
                fileStream.pipe(fs.createWriteStream(newPath))
                //Change mod.txt
                const modTXT = path.join(__dirname, "mods", modName, "/mod.txt")
                let shouldAdd = true
                let rawmod = fs.readFileSync(modTXT).toString()
                mod = parser.preparseFile(rawmod)
                let modText = []
                mod.forEach(line => {
                    if(line.search(/Logo\s*=\s*.*/)>= 0) shouldAdd = false
                    line = line.replace(/Logo\s*=\s*.*/i, 'Logo="' + fileName + '"\n')
                    modText.push(line)
                })
                //Add new line after author with the logo
                if(shouldAdd) {
                    mod.forEach(line => {
                        if(line.substr(0, 2) == "//") return
                        if(line.search(/Author\s*=/) >= 0) modText.push('Logo = ' + fileName)
                    })
                }
                //Now write to file
                let ret = parser.writeToFile(modText, modTXT)
                //Send back new logo path
                console.log("sent!")
                res.json("mods/" + modName + "/media/" + fileName)
            })
            req.pipe(req.busboy)
        }
        console.log("fin")
    },

    updateMod: (req, res) => {
        let fileName = path.join(__dirname, "mods", req.params.mod, '/mod.txt')
        if (!fs.existsSync(fileName)) {
            res.json({error: 'Mod does not exist'})
        } else {
            let mod = fs.readFileSync(fileName).toString()
            console.log(mod)
            mod = mod.replace(/Name\s*=\s*.*\n/i, 'Name="' + req.body.name + '"\n')
            mod = mod.replace(/Version\s*=\s*.*\n/i, 'Version="' + req.body.version + '"\n')
            mod = mod.replace(/Author\s*=\s*.*\n/i, 'Author="' + req.body.author + '"\n')
            mod = mod.replace(/Description\s*=\s*.*\n/i, 'Description="' + req.body.description + '"\n')
            console.log(mod)
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
