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
        try{
            let fileName = path.join(__dirname, '/mods/', modId, '/mod.txt')
            modData = parser.readNewFile(fileName)
            //Add mod id
            modData.id = modId
            console.log("New mod id: " + modId)
            mods.push(modData)
        } catch(e){
            console.log("Did not find mod file: " + modId)
            return false
        }}
    return {
        id: modData.id,
        name: modData.name,
        author: modData.author,
        version: modData.version,
        description: stripJs(modData.description),
        logo: '/mods/' + modId + '/media/' + modData.logo
    }
}

function updateMod(newVersion){
    mods.forEach(mod => {
        if(mod.id === newVersion.id){
            mod = newVersion
            return mod
        }
        console.log("Looking at mod "+ mod.id + " but looking for " + newVersion.id)
    })
    console.log("No mod found! Searched for: " + newVersion.id)
}

function saveModFile(mod) {
    if(typeof mod !== "object"){
        console.log("Searching for mod with id: " + mod)
        //Act as if mod id
        mods.forEach(_mod => {
            if(_mod.id === mod) mod = _mod
        })
    }
    console.log("Saving mod: " + mod.id)
    parser.writeToFile(parser.fromObjectToText(mod), "./mods/" + mod.id + "/mod.txt")
    return updateMod(mod)
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
        let file = path.join(__dirname, 'mods', req.params.mod, req.params.file)
        console.log(file)
        if (fs.existsSync(file)) {
            res.sendFile(file)
        } else {
            res.sendFile(path.join(__dirname, 'plug.png'))
        }
    },

    createMod: (req,res) => {
        if(readModFile(req.body.id)) {
            console.log("Project already exits!")
            res.json({error:"A mod with this ID already exists!"})
            return
        }
        const dPath = path.join(__dirname, "mods", req.body.id)
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
                    if (mod.id === req.params.mod) {
                        console.log("Uploaded picture to mod: " + mod.id)
                        mod.logo = fileName
                        saveModFile(mod)
                    } else{ console.log("Wrong mod: " + mod.id + " Wants: " + req.params.mod)}
                })
                //Send back new logo path
                res.json("mods/" + modName + "/media/" + fileName)
            })
            req.pipe(req.busboy)
        } else{
            console.log("req.busboy was not added to the picture upload!")
            res.json("Error!")
        }
    },

    updateMod: (req, res) => {
        let toUpdate
        if(toUpdate = readModFile(req.params.mod)){
            toUpdate.name = req.body.name
            toUpdate.version = req.body.version
            toUpdate.author = req.body.author
            toUpdate.description = req.body.description
            res.json(saveModFile(toUpdate))
        }else{
            res.json({error: "Mod has not been found!"})
        }
    }
}
