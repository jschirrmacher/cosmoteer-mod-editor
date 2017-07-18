/*eslint-env node*/
'use strict'

const fs = require('fs')
const path = require('path')
const parser = require('./parseFile')
const glob = require('glob')
const stripJs = require('strip-js')
const winston = require('winston')
const iso = require('iso-639-1')

let mods = {}

function readModFile(modId, dir = '/mods/', test = false) {
    if (!mods[modId]) {
        let modData = {}
        try {
            modData = parser.readNewFile(path.join(__dirname, dir, modId, '/mod.txt'), test)
            modData.id = modId
            if (modData.stringsfolder) {
                modData.ignore.languages = parser.getLanguages(path.join(__dirname, dir, modId, modData.stringsfolder))
            } else modData.ignore.languages = []
            modData.ignore.keyWords = []
            modData.description = stripJs(modData.description)
            if (!test) {
                mods[modId] = modData
            }
        } catch (e) {
            winston.warn(e)
            winston.warn('Did not find mod file for: ' + modId)
        }
    }
    return mods[modId]
}

function saveModFile(mod) {
    fs.writeFileSync('./mods/' + mod.id + '/mod.txt', parser.toString(mod))
    return mod
}

function updateShipLibrary(modId, dirName, titleId) {
    fs.mkdirSync(path.join(__dirname, 'mods', modId, dirName), '0755')
    if (!readModFile(modId)) {
        return {error: 'Mod not found'}
    } else {
        if (!mods[modId].shiplibraries) {
            mods[modId].shiplibraries = []
        }
        mods[modId].shiplibraries.push({folder: dirName, namekey: titleId})
        mods[modId].ignore.keyWords.push(titleId)
        return mods[modId]
    }
}

function updateLanguage(modId, lang) {
    if (!readModFile(modId)) {
        return {error: 'Mod not found!'}
    } else if (!iso.validate(lang)) {
        return {error: lang + ' is not a valid language code!'}
    } else if (mods[modId].ignore.languages && mods[modId].ignore.languages.indexOf(lang) >= 0) {
        return {error: 'This language file has already been created!'}
    } else if (!mods[modId].stringsfolder) {
        return {error: 'This mod does not have a Strings folder. Please define this first in the main mod options.'}
    } else {
        fs.writeFileSync(path.join(__dirname, 'mods', modId, mods[modId].stringsfolder, lang + '.txt'), '')
        mods[modId].ignore.languages.push({id: lang, keywords: []})
        saveModFile(mods[modId])
        return mods[modId]
    }
}

module.exports = {
    readModFile,

    listMods: (req, res) => {
        glob('mods/*/mod.txt', (err, files) => {
            res.json({
                mods: files.map(file => {
                    let modId = file.replace(/mods\/(.*?)\/mod.txt/, '$1')
                    try {
                        let mod = Object.assign({id: modId}, readModFile(modId))
                        if (mod.name !== undefined) {
                            mod.logo = '/mods/' + mod.id + '/media/' + mod.logo
                        }
                        return mod
                    } catch (e) {
                        winston.warn(e)
                        winston.warn('Mod \'%s\' failed to load. Is the mod.txt correct? ', modId)
                        return null
                    }
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
        if (readModFile(req.body.id)) {
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
        //Create mod.txt and load it into the mods via readModFile()
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
        if (!readModFile(req.params.mod)) {
            res.json({error: 'Mod not found'})
        } else {
            mods[req.params.mod].name = req.body.name
            mods[req.params.mod].version = req.body.version
            mods[req.params.mod].author = req.body.author
            mods[req.params.mod].description = req.body.description
            res.json(saveModFile(mods[req.params.mod]))
        }
    },

    mainModData: (req, res) => {
        if (!readModFile(req.params.mod)) {
            res.json({error: 'Mod not found'})
        } else {
            res.json({
                stringsfolder: mods[req.params.mod].stringsfolder || ''
            })
        }
    },

    changeMainModData: (req, res) => {
        if (!readModFile(req.params.mod)) {
            res.json({error: 'Mod not found'})
        } else {
            if (req.params.id === 'stringsfolder') {
                if (mods[req.params.mod].stringsfolder) {
                    fs.renameSync(
                        path.join(__dirname, 'mods', req.params.mod, mods[req.params.mod].stringfolder),
                        path.join(__dirname, 'mods', req.params.mod, req.params.value)
                    )
                } else {
                    fs.mkdirSync(path.join(__dirname, 'mods', req.params.mod, req.params.value))
                }
                mods[req.params.mod].stringfolder = req.params.value
                res.json(saveModFile(mods[req.params.mod]))
            }
        }
    },

    createPart: (req, res) => {
        let actions = {
            shipLibrary: () => updateShipLibrary(req.params.mod, req.body.dirName, req.body.titleId),
            language: () => updateLanguage(req.params.mod, req.body.lang)
        }
        try{
            res.json(actions[req.params.type])
        } catch (e) {
            winston.error('Part of unknown type was trying to be created: '+ req.params.type)
            res.json({error: 'Unknown type'})
        }
    },

    updatePart: (req, res) => {
        res.json(req.body)
    },

    getLanguageOverview: (req, res) => {
        res.json({languages: mods[req.params.mod].ignore.languages, keywords: mods[req.params.mod].ignore.keyWords})
    }
}
