'use strict'

const fs = require('fs')
const path = require('path')
const parser = require("./parseFile")
const glob = require('glob')
const stripJs = require('strip-js')

let mods = []

function readModFile(modId) {
    let modData
    //Find in mods
    mods.forEach(mod => {
        if(mod.id == modId) modData = mod
    })
    if(!modData){
        var fileName = path.join(__dirname, '/mods/', modId, '/mod.txt')
        modData = parser.readNewFile(fileName)
        //Add mod id
        modData.id = modId
        mods.push(modData)
    }
    if(!modData) return false
    return {
        id: modData.id,
        name: modData.name,
        author: modData.author,
        version: modData.version,
        description: stripJs(modData.description),
        logo: '/mods/' + modId + '/media/' + modData.logo
    }
}

function saveModFile(mod) {
    if(typeof mod !== "object"){
        //Act as if mod id
        mods.forEach(_mod => {
            if(_mod.id === mod) mod = _mod
        })
    }
    parser.writeToFile(parser.fromObejctToText(mod), "./mods/" + mod.id + "/mod.txt")
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

    createMod: (req,res) => {
        if(this.readModFile(req.body.id)) {
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
                    break
                default:
                    console.log("An unknown type of line was trying to be inserted into a new mod: " + line.typ)
            }
        })
        //Create mod.txt and laod it into the mods via readModFile()
        fs.writeFile(path.join(__dirname, "/mods/", req.body.id, "/mod.txt"), txt, err => {
            if (err) {
                res.json({error: err})
            } else {
                res.json(readModFile(req.body.id))
            }
        })
    },

    uploadPicture: (req,res) => {
        if (req.busboy) {
            req.busboy.on("file", (fieldName, fileStream, fileName) => {
                //Save picture
                const modName = req.params.mod
                let newPath = path.join(__dirname, "mods", modName, fileName)
                fileStream.pipe(fs.createWriteStream(newPath))
                //Change the mod in mods
                mods.forEach(mod => {
                    if (mod.id === req.body.id) {
                        mod.logo = fileName
                    }
                    //Send back new logo path
                    res.json("mods/" + modName + "/media/" + fileName)
                    return
                })

            })
            req.pipe(req.busboy)
        }
        res.json("Error!")
    },

    updateMod: (req, res) => {
        let toUpdate
        if(!(toUpdate = this.readModFile(req.params.mod))){
            toUpdate.name = req.body-name
            toUpdate.version = req.body.version
            toUpdate.author = req.body.author
            toUpdate.description = req.body.description
            res.json(readModFile(req.params.mod))
            saveModFile(toUpdate)
            return
        }
        res.json({error: "Mod has not been found!"})
    }
}
