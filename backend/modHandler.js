/*eslint-env node*/
'use strict'

const fs = require('fs')
const path = require('path')
const parser = require('./parseFile')
const glob = require('glob')
const stripJs = require('strip-js')
const winston = require('winston')

let mods = []

function readModFile(modId, dir = '/mods/', test = false) {
    let modData
    //Find in mods
    mods.forEach(mod => {
        if(mod.id == modId) modData = mod
    })
    if(!modData){
        try{
            let fileName = path.join(__dirname, dir, modId, '/mod.txt')
            modData = parser.readNewFile(fileName, test)
            //Add mod id
            modData.id = modId
            if(!test){
                winston.log('New mod id: ' + modId)
                mods.push(modData)
            }
        } catch(e){
            if(!test) winston.log('Did not find mod file: ' + modId + e)
            return false
        }
    }
    modData.description = stripJs(modData.description)
    return modData
}

function updateMod(newVersion){
    let updatedMod
    mods = mods.map(mod => {
        if(mod.id === newVersion.id){
            mod = newVersion
            updatedMod = mod
        }
        return mod
    })
    return updatedMod
}

function saveModFile(mod) {
    if (typeof mod !== 'object') {
        //Act as if mod id
        mods.forEach(_mod => {
            if(_mod.id === mod) mod = _mod
        })
    }
    fs.writeFileSync('./mods/' + mod.id + '/mod.txt', parser.toString(mod))
    return updateMod(mod)
}

module.exports = {
    readModFile,

    listMods: (req, res) => {
        glob('mods/*/mod.txt', (err, files) => {
            res.json({
                mods: files.map(file => {
                    let mod = Object.assign({},readModFile(file.replace(/mods\/(.*?)\/mod.txt/, '$1')))
                    if(!mod) {winston.log('error', 'This mod failed to load. Is the mod.txt correct? '); return null}
                    if(mod.name !== undefined) mod.logo = '/mods/' + mod.id + '/media/' + mod.logo
                    return mod
                }).filter(mod => mod)
            })
        })
    },

    getMediaFile: (req, res) => {
        let file = path.join(__dirname, 'mods', req.params.mod, req.params.file)
        if (fs.existsSync(file)) {
            res.sendFile(file)
        } else {
            res.sendFile(path.join(__dirname, 'plug.png'))
        }
    },

    createMod: (req,res) => {
        if(readModFile(req.body.id)) {
            winston.log('debug','Project already exits!')
            res.json({error:'A mod with this ID already exists!'})
            return
        }
        const dPath = path.join(__dirname, 'mods', req.body.id)
        fs.mkdirSync(dPath)
        //Create Text
        let txt = ''
        let rules = JSON.parse(fs.readFileSync('./templates/mod.json','utf8'))
        rules.forEach(line => {
            switch(line.typ){
                case 'copy':
                    txt += line.text + '\n'
                    break
                case 'combine':
                    if(line.quote){
                        txt += line.text + '\'' + req.body[line.value] + '\' \n'
                    } else{
                        txt += line.text + req.body[line.value] + '\n'
                    }
                    break
                default:
                    winston.log('error', 'An unknown type of line was trying to be inserted into a new mod: ' + line.typ)
            }
        })
        //Create mod.txt and laod it into the mods via readModFile()
        fs.writeFile(path.join(__dirname, '/mods/', req.body.id, '/mod.txt'), txt, err => {
            if (err) {
                res.json({error: err})
            } else {
                res.json(readModFile(req.body.id))
            }
        })
    },

    uploadPicture: (req,res) => {
        if (req.busboy) {
            req.busboy.on('file', (fieldName, fileStream, fileName) => {
                //Save picture
                const modName = req.params.mod
                let newPath = path.join(__dirname, 'mods', modName, fileName)
                fileStream.pipe(fs.createWriteStream(newPath))
                //Change the mod in mods
                mods.forEach(mod => {
                    if (mod.id === req.params.mod) {
                        winston.log('info', 'Uploaded picture to mod: ' + mod.id)
                        mod.logo = fileName
                        saveModFile(mod)
                    }
                })
                //Send back new logo path
                res.json('mods/' + modName + '/media/' + fileName)
            })
            req.pipe(req.busboy)
        } else{
            winston.log('error', 'req.busboy was not added to the picture upload!')
            res.json('Error!')
        }
    },

    updateMod: (req, res) => {
        let toUpdate
        if ((toUpdate = readModFile(req.params.mod))) {
            toUpdate.name = req.body.name
            toUpdate.version = req.body.version
            toUpdate.author = req.body.author
            toUpdate.description = req.body.description
            res.json(saveModFile(toUpdate))
        }else{
            res.json({error: 'Mod has not been found!'})
        }
    },

    mainModData: (req, res) => {
        let found = false
        const needed = ['stringsfolder']
        mods.forEach(mod => {
            if(mod.id === req.params.mod) {
                found = true
                let data = []
                needed.forEach(part => {
                    let obj = {}
                    if (mod[part] !== undefined) obj[part] = mod[part]
                    else obj[part] = ''
                    data.push(obj)
                })
                res.json(data)
            }
        })
        if(!found)res.json({error: "Did not find mod!"})
    },

    changeMainModData: (req, res) => {
        let found = false
        mods.forEach(mod => {
            if(mod.id == req.params.mod) {
                switch(req.params.id){
                    case 'stringsfolder':
                        if(mod[req.params.id] !== undefined){
                            fs.renameSync(path.join(__dirname, 'mods', req.params.mod, mod[req.params.id]),
                                path.join(__dirname, 'mods', req.params.mod, req.params.value))
                        } else{
                            fs.mkdirSync(path.join(__dirname, 'mods', req.params.mod, req.params.value))
                        }
                        break
                    default:
                        winston.error('The following id is not defiend as a mod.txt option: ' + req.params.id)
                }
                winston.error(mod)
                mod[req.params.id] = req.params.value
                if(mod.ignore !== undefined){
                    mod.ignore.toAdd = mod.ignore.toAdd.forEach(needed => {
                        if(!needed === req.params.id) needed
                    })
                }
                res.json('OK')
                found = true
                saveModFile(mod)
            }
        })
        if(!found){
            winston.log('debug', 'Did not find mod + ' + req.params.mod)
            res.json('ERROR')
        }
    },

    createPart: (req, res) => {
        fs.mkdirSync(path.join(__dirname, 'mods', req.params.mod, req.body.dirName), '0755')
        let mod = readModFile(req.params.mod)
        if (!mod.shiplibraries) {
            mod.shiplibraries = []
        }
        mod.shiplibraries.push({folder: req.body.dirName, namekey: req.body.titleId})
        res.json(saveModFile(mod))
        res.json(req.body)
    },

    updatePart: (req, res) => {
        res.json(req.body)
    }
}
