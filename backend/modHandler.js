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
            modData.ignore.id = modId
            if (modData.stringsfolder) {
                let langData = parser.getLanguages(path.join(__dirname, dir, modId, modData.stringsfolder))
                modData.ignore.languages = langData[0]
                modData.ignore.keyWords = langData[1]
            } else {
                modData.ignore.languages = []
                modData.ignore.keyWords = []
            }
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
    winston.debug('Saving')
    fs.writeFileSync('./mods/' + mod.ignore.id + '/mod.txt', parser.toString(Object.assign({}, mod)))
    return mod
}

function updateShipLibrary(modId, dirName, titleId, fn) {
    if (!readModFile(modId)) {
        fn({error: 'Mod not found'})
    } else {
        fs.mkdir(path.join(__dirname, 'mods', modId, dirName), '0755', (e) => {
            winston.debug('Created dir')
            if(e) {
                winston.error(e)
                return {error: 'This directory already exists!'}
            }
            if (!mods[modId].shiplibraries) {
                mods[modId].shiplibraries = []
            }
            mods[modId].shiplibraries.push({folder: dirName, namekey: titleId})
            mods[modId].ignore.keyWords.push(titleId)
            saveModFile(mods[modId])
            fn(mods[modId])
        })
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
        winston.info('Creating the file')
        fs.writeFileSync(path.join(__dirname, 'mods', modId, mods[modId].stringsfolder, lang + '.txt'), '')
        winston.info(mods[modId])
        mods[modId].ignore.languages.push({id: lang, keywords: {}})
        winston.info(mods[modId])
        return saveModFile(mods[modId])
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
                            mod.logo = '/mods/' + mod.ignore.id + '/media/' + mod.logo
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
        let file = req.params.dir ? path.join(__dirname, 'mods', req.params.mod, req.params.dir, req.params.file) :
            path.join(__dirname, 'mods', req.params.mod, req.params.file)
        winston.debug(file)
        if (fs.existsSync(file)) {
            winston.debug('Sending file')
            res.sendFile(file)
        } else {
            res.sendFile(path.join(__dirname, 'plug.png'))
        }
    },

    createMod: (req,res) => {
        if (fs.existsSync(path.join(__dirname, 'mods', req.body.id))) {
            winston.debug('Project already exits!')
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
                    winston.error('An unknown type of line was trying to be inserted into a new mod: ' + line.typ)
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
        const modId = req.params.mod
        if (!req.files || !req.files[modId + 'file-input']) {
            res.json({error: 'Missing upload file'})
        } else {
            let file = req.files[modId + 'file-input']
            let newPath = path.join(__dirname, 'mods', modId, file.name)
            file.mv(newPath, err => {
                if (err) {
                    res.json({error: err})
                } else {
                    mods[modId].logo = file.name
                    winston.debug('Uploaded picture to mod: ' + mods[modId].ignore.id)
                    saveModFile(mods[modId])
                    res.json('mods/' + modId + '/media/' + file.name)
                }
            })
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
                        path.join(__dirname, 'mods', req.params.mod, mods[req.params.mod].stringsfolder),
                        path.join(__dirname, 'mods', req.params.mod, req.params.value)
                    )
                } else {
                    fs.mkdirSync(path.join(__dirname, 'mods', req.params.mod, req.params.value))
                }
                mods[req.params.mod].stringsfolder = req.params.value
                res.json(saveModFile(mods[req.params.mod]))
            }
        }
    },

    createPart: (req, res) => {
        if(!mods[req.params.mod]) {
            res.json({error: 'This mod is not defined! ' + req.params.mod})
            return
        }
        let actions = {
            shipLibrary: () => updateShipLibrary(req.params.mod, req.body.dirName, req.body.titleId, (r) => res.json(r)),
            language: () => res.json(updateLanguage(req.params.mod, req.body.lang))
        }
        try{
            actions[req.params.type]()
        } catch (e) {
            winston.error('Part of unknown type was trying to be created: '+ req.params.type)
            winston.error(e)
            res.json({error: 'Unknown type'})
        }
    },

    updatePart: (req, res) => {
        res.json(req.body)
    },

    getLanguageOverview: (req, res) => {
        try{
            res.json({languages: mods[req.params.mod].ignore.languages, keywords: mods[req.params.mod].ignore.keyWords})
        } catch (e) {
            winston.error(e)
            res.json({error: 'Can not get language!'})
        }
    },

    getMod: (req, res) => {
        if(mods[req.params.mod]){
            res.json({data: mods[req.params.mod]})
        } else{
            res.json({error: 'Mod not found!'})
        }
    },

    editLanguage: (req, res) => {
        if(mods[req.params.mod]){
            Object.keys(req.body).forEach(lang => {
                mods[req.params.mod].ignore.languages = mods[req.params.mod].ignore.languages.map(bLang => {
                    if(bLang !== undefined){
                        if(lang === bLang.id){
                            Object.keys(req.body[lang]).forEach(key => {
                                bLang.keywords[key] = req.body[lang][key]
                            })
                        }
                        return bLang
                    }
                })
            })
            saveModFile(mods[req.params.mod])
            res.json(mods[req.params.mod].ignore.languages)
        } else res.json({error: 'Mod not found!'})
    },

    uploadPictures: (req, res) => {
        const modId = req.params.mod
        if (!readModFile(modId)) {
            res.json({error: 'Mod not found'})
        } else {
            let ships = []
            Object.keys(req.files).forEach(field => {
                let fileName = req.files[field].name
                winston.debug('File: ' + fileName)
                let newPath = path.join(__dirname, 'mods', modId, req.params.folder, fileName)
                req.files[field].mv(newPath, err => {
                    if (err) {
                        throw err
                    } else {
                        ships.push({image: fileName})
                    }
                })
            })
            res.json({ships})
        }
    },

    getShipLibrary: (req, res) => {
        let modName = req.params.mod
        if(mods[modName]){
            var path2 = path.join(__dirname, 'mods', modName, req.params.folder)
            let paths = fs.readdirSync(path2)
            paths = paths.map(Path => {
                return path.join('mods', modName, 'media', req.params.folder, Path)
            })
            winston.debug(paths)
            res.json({paths: paths})
        } else {
            res.json({error: 'This mod does not exist!'})
        }
    }
}
