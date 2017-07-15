/**
 * Created by Jasper on 12.07.2017.
 */
"use strict";
const fs = require("fs")
const tokeniser = require("./tokeniser")

const rules = [
    {type: "whitespace", regex: /^[\r\n\t ]+$/},
    {type: "arrayStart", regex: /^[a-zA-Z]+\s*\[$/},
    {type: "objectStart", regex: /^[a-zA-Z]+\s*\{$/},
    {type: "bracket", regex: /^[\[\]\{\}]$/},
    {type: "string", regex: /^[^\r\n\[\]\{\}]+$/}
]

const newRules = require("./rules")

exports.preparseFile = (text, activeRules) => {
    let rawLines
    rawLines = tokeniser(text, activeRules).map(element => element.source.trim()).filter(element => !element.match(/^$/))
}

exports.newParser = (fileName) => {
    return tokeniser(fs.readFileSync(fileName).toString().replace(/\r/g, ""), newRules)
}

exports.readNewFile = (fileName) => {
    let tokenArray = this.newParser(fileName)
    if(tokenArray[0].type === "arrayStart"){tokenArray.shift(); return createArray(tokenArray)}
    else if(tokenArray[0].type === "objectStart") {tokenArray.shift(); return createObj(tokenArray)}
    else return createObj(tokenArray)
}

function createObj(tokenArray){
    let token
    let obj
    obj = {}
    while(token = tokenArray.shift()){
        if(token.type === "definition") obj[token.matches[1]] = cleanse(token.matches[2])
        else if(token.type === "arrayStart") obj[token.matches[1]] = createArray(tokenArray)
        else if(token.type === "arrayEnd") {console.log(token.matches); throw "Can not end array in object"}
        else if(token.type === "objectStart" ) obj[token.matches[1]] = (createObj(tokenArray))
        else if(token.type === "objectEnd") break
        else if(token.type === "line") {console.log(token.matches); throw "Can not add unnamed value(line) to object"}
    }
    return obj
}

function createArray(tokenArray){
    let token
    let obj
    obj = []
    while(token = tokenArray.shift()){
        if(token.type === "definition") throw "Definitions can not be added directly to array " + token.matches
        else if(token.type === "arrayStart" ) obj.push(createArray(tokenArray))
        else if(token.type === "arrayEnd") return obj
        else if(token.type === "objectStart") obj.push(createObj(tokenArray))
        else if(token.type === "objectEnd") throw tokenArray
        else if(token.type === "line") obj.push(cleanse(token.matches[0]))
    }
    return obj
}

function cleanse(string){
    return string.trim().replace(/^"|"$/g, "")
}

exports.writeToFile = (lines, file, overwrite = true) => {
    let tabcounter
    tabcounter = 0
    let toWrite
    toWrite = ""
    console.log(lines)
    lines.forEach((line) => {
        //add new line
        line += line.substr(-1) == "\n" ? "" : "\n"
        //add tabs
        for (let i = 0; i < tabcounter; i++) line = "\t" + line

        toWrite += line
        console.log("---" + line)

        tabcounter += line.search(/[\[\{]]/) + 1
        tabcounter -= line.search(/[\]\}]/) + 1
    })
    console.log(toWrite)
    fs.writeFileSync(file, toWrite)
}

exports.readFile = (fileName) => {
    let data
    data = {randomData: []}
    let stack
    stack = [data]
    let active
    active = data
    let toAdd
    toAdd = undefined
    let newVersion
    newVersion = []
    const lines = this.preparseFile(fs.readFileSync(fileName).toString(), rules)
    newVersion = []
    lines.forEach(line => {
        //Test if comma
        if (line.substr(0, 2) === "//") return

        line = line.replace(/\\n/g, "\n")

        //Should add to last
        if (toAdd) {
            let cont = false
            if (line.substr(-1) === '\\') {
                line = line.substr(0, line.length - 1)
                cont = true
            }
            active[toAdd] += line.trim().replace(/^"|"$/g, '')
            if (!cont) {
                toAdd = undefined
            }
            return
        }
        //Test if value declaration
        const splitLine = line.split("=")
        if (splitLine.length === 2) {
            let key = splitLine[0].trim()
            if (line.substr(-1) === "\\") {
                splitLine[1] = splitLine[1].substr(0, splitLine[1].length - 1)
                toAdd = key
            }
            active[key] = splitLine[1].trim().replace(/^"|"$/g, '')
        }
        //
        else {
            if (line.substr(-1) === "[") {
                active[line.substr(0, line.length - 1).trim()] = []
                stack.push(active[line.substr(0, line.length - 1).trim()])
                active = stack[stack.length - 1]
            } else if (line == "[") {
                //todo: handle unammed Arrays
                //todo: unnammed Arrays werden nicht in den Stack gepuscht, da sie nur skalars haben
                throw "This has not been implemented! " + line
            } else if (line === "]" || line === "}") {
                active = stack[stack.length - 2]
                stack.pop()
            } else if (line == "{") {
                if (Array.isArray(active)) {
                    active.push({})
                    stack.push(active[active.length - 1])
                    active = active[active.length - 1]
                    active.randomData = []
                } else {
                    //todo: handle unnammed objects in obejcts (if that occurs)
                    throw "This has not been implemented!" + line
                }
            } else {
                //todo: handle links + other data
                if (Array.isArray(active)) {
                    active.push(line)
                } else {
                    active.randomData.push(line)
                }
            }
        }
    })
    return data;
}
