/**
 * Created by Jasper on 12.07.2017.
 */
'use strict'
const fs = require('fs')
const tokeniser = require('./tokeniser')

const newRules = require('./rules')

exports.preparseFile = (text, activeRules) => {
    return tokeniser(text, activeRules).map(element => element.source.trim()).filter(element => !element.match(/^$/))
}

exports.newParser = (fileName) => {
    return tokeniser(fs.readFileSync(fileName).toString().replace(/\r/g, ''), newRules)
}

exports.readNewFile = (fileName) => {
    let tokenArray = this.newParser(fileName)
    try{
        if (tokenArray[0].type === 'arrayStart') {
            tokenArray.shift()
            return createArray(tokenArray)
        } else if (tokenArray[0].type === 'objectStart') {
            tokenArray.shift()
            return createObj(tokenArray)
        } else {
            return createObj(tokenArray)
        }
    } catch (e) {
        console.log("Error --------------------") //eslint-disable-line no-console
        console.log("Error in file: " + fileName) //eslint-disable-line no-console
        throw e
    }
}

function createObj(tokenArray) {
    let token
    let obj
    obj = {}
    try {
        while ((token = tokenArray.shift())) {
            if (token.type === 'definition') obj[token.matches[1].toLowerCase()] = handleContinuation(token.matches[2])
            else if (token.type === 'arrayStart') obj[token.matches[1].toLowerCase()] = createArray(tokenArray)
            else if (token.type === 'arrayEnd') throw 'Can not end array in object'
            else if (token.type === 'objectStart') obj[token.matches[1].toLowerCase()] = createObj(tokenArray)
            else if (token.type === 'objectEnd') break
            else if (token.type === 'line') throw 'Can not add unnamed value(line) to object'
        }
    } catch (e) {
        console.log(token.matches) // eslint-disable-line no-console
        throw e
    }
    return obj
}

function createArray(tokenArray) {
    let token
    let obj
    obj = []
    try {
        while ((token = tokenArray.shift())) {
            if (token.type === 'definition') throw 'Definitions can not be added directly to array'
            else if (token.type === 'arrayStart') obj.push(createArray(tokenArray))
            else if (token.type === 'arrayEnd') return obj
            else if (token.type === 'objectStart') obj.push(createObj(tokenArray))
            else if (token.type === 'objectEnd') throw 'Cannot end object in array'
            else if (token.type === 'line') obj.push(cleanse(token.matches[0]))
        }
    } catch (e) {
        console.log(token.matches) // eslint-disable-line no-console
        throw e
    }
    return obj
}

function cleanse(string) {
    return string.trim().replace(/^"|"$/g, '')
}

function handleContinuation(str) {
    return str.split('\\').map(cleanse).join('')
}

exports.writeToFile = (lines, file) => {
    let tabcounter
    tabcounter = 0
    let toWrite
    toWrite = ''
    lines.forEach((line) => {
        //add new line
        line += line.substr(-1) == '\n' ? '' : '\n'
        //add tabs
        for (let i = 0; i < tabcounter; i++) line = '\t' + line

        toWrite += line

        tabcounter += line.search(/[\[\{]]/) + 1
        tabcounter -= line.search(/[\]\}]/) + 1
    })
    fs.writeFileSync(file, toWrite)
}

exports.fromObjectToText = (mod) => {
    let text = []
    if(mod.constructor === Array) addArray(mod)
    else addObject(mod)
    function addArray(array, name = ""){
        text.push(name + "[")
        array.forEach(value => {
            if(value.constructor === Array) addArray(value)
            else if(typeof value === "object") addObject(value)
            else text.push(value.toString())
        })
        text.push("]")
    }
    function addObject(object, name = ""){
        text.push(name + "{")
        for(let prop in object){
            if(object.hasOwnProperty(prop)){
                if(prop === "nonamed") text.append(object[prop])
                else if(object[prop].constructor === Array) addArray(object[prop], prop)
                else if(typeof object[prop] === "object") addObject(object[prop], prop)
                else text.push(prop + ' = "' + object[prop] + '"')
            }
        }
        text.push("}")
    }
    return text
}