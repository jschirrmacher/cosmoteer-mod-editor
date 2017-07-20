/**
 * Created by Jasper on 12.07.2017.
 */
'use strict'
const fs = require('fs')
const tokeniser = require('js-tokeniser')
const winston = require('winston')
const iso = require('iso-639-1')


const newRules = require('./rules')

function throwError(errorMessage, additionalData = []){
    additionalData.forEach(data => {
        winston.log('error', data.toString())    //eslint-disable-line no-console
    })
    throw errorMessage
}

exports.newParser = (fileName) => {
    return tokeniser(fs.readFileSync(fileName).toString().replace(/\r/g, ''), newRules)
}

exports.getLanguages = (directoryPath) => {
    let langFiles = []
    let files = fs.readdirSync(directoryPath)
    files.forEach(file => {
        var replace = file.replace('.txt', '')
        if(iso.validate(replace)) langFiles.push({id: replace, keywords: []})
    })
    return langFiles
}

exports.readNewFile = (fileName) => {
    let returnValue = createObj(this.newParser(fileName))
    returnValue.ignore = {}
    return returnValue
}

function createObj(tokenArray) {
    let token
    let obj
    obj = {}
    while ((token = tokenArray.shift())) {
        if (token.type === 'definition') obj[token.matches[1].toLowerCase()] = handleContinuation(token.matches[2])
        else if (token.type === 'arrayStart') obj[token.matches[1].toLowerCase()] = createArray(tokenArray)
        else if (token.type === 'arrayEnd') throwError('Can not end array in object', [token.matches])
        else if (token.type === 'objectStart') obj[token.matches[1].toLowerCase()] = createObj(tokenArray)
        else if (token.type === 'objectEnd') break
        else if (token.type === 'line') throwError('Can not add unnamed value(line) to object', [token.matches])
    }
    return obj
}

function createArray(tokenArray) {
    let token
    let obj
    obj = []
    while ((token = tokenArray.shift())) {
        if (token.type === 'definition') throwError('Definitions can not be added directly to array', [token.matches])
        else if (token.type === 'arrayStart') obj.push(createArray(tokenArray))
        else if (token.type === 'arrayEnd') return obj
        else if (token.type === 'objectStart') obj.push(createObj(tokenArray))
        else if (token.type === 'objectEnd') throwError('Cannot end object in array', [token.matches])
        else if (token.type === 'line') obj.push(cleanse(token.matches[0]))
    }
    return obj
}

function cleanse(string) {
    return string.trim().replace(/^"|"$/g, '')
}

function handleContinuation(str) {
    return str.split(/\\\n/).map(cleanse).join('')
}

//Will delete ignore, only send copy not be reference!!!
function toString(value, level = 0, useTabs = true) {
    function tabs(str, num = level) {
        return Array(num).join('\t') + str
    }

    function isArray(value) {
        return value.constructor === Array
    }

    function isObject(value) {
        return typeof value === 'object'
    }

    function isNumeric(value) {
        return !Number.isNaN(value) && Number.isFinite(value)
    }
    delete value.ignore
    if (isArray(value)) {
        return (useTabs ? tabs('[\n') : '[\n')
            + value.map(entry => toString(entry, level + 1)).join('\n') + '\n'
            + tabs(']')
    } else if (isObject(value)) {
        let elems = Object.keys(value).map(key => {
            let concat = isArray(value[key]) || isObject(value[key]) ? ' ' : ' = '
            return tabs(key + concat, level + 1) + toString(value[key], level + 1, false)
        }).join('\n') + '\n'
        return level ? tabs('{\n') + elems + tabs('}') : elems
    } else {
        value = isNumeric(value) ? value : '"' + value.replace(/\n/g, '\\n') + '"'
        return useTabs ? tabs(value) : value
    }
}

exports.toString = toString
