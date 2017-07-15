/**
 * Created by Jasper on 12.07.2017.
 */
"use strict";
const fs = require("fs")
const tokeniser = require("tokenizer-array")

const rules = [
    {type: "whitespace", regex: /^[\r\n\t ]+$/},
    {type: "arrayStart", regex: /^[a-zA-Z]+\s*\[$/},
    {type: "objectStart", regex: /^[a-zA-Z]+\s*\{$/},
    {type: "bracket", regex: /^[\[\]\{\}]$/},
    {type: "string", regex: /^[^\r\n\[\]\{\}]+$/}
]

const newRules = [
    {type: "comment", regex: /^\s*\/\/[^\n]*$/},
    {type: "definition", regex: /^\s*\w+\s*=(?:[^\n]+\\\n)*[^\n]+$/},
    {type: "arrayStart", regex: /^\s*\w*\s*\[$/},
    {type: "arrayEnd", regex: /^\s*\]$/},
    {type: "objectStart", regex: /^.*\n?\{$/},
    {type: "objectEnd", regex: /^\s*\}$/},
    {type: "line", regex: /^.+$/},
    {type: "emptyLine", regex: /^\n*$/}
]


exports.preparseFile = (text, activeRules) => {
    let rawLines
    rawLines = tokeniser(text, activeRules).map(element => element.source.trim()).filter(element => !element.match(/^$/))
}

exports.newParser = (fileName) => {
    return tokeniser(fs.readFileSync(fileName).toString().replace(/\r/g, ""), newRules).map((token) => {
        token.source = token.source.trim()
        return token
    })
}

function turnToObj(tokenArray){
    let token
    let obj
    let i
    obj = {}
    while(token = tokenArray.pop()){
        if(token.type === "arrayStart") i = 0
    }
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
