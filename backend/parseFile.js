/**
 * Created by Jasper on 12.07.2017.
 */
"use strict";
const fs = require("fs")
const tokeniser = require("node-tokenizer")

tokeniser.rule("whitespace", /^[\r\n\t ]+/)
tokeniser.rule("arrayStart", /^[a-zA-Z]+\s*\[/)
tokeniser.rule("objectStart", /^[a-zA-Z]+\s*\{/)
tokeniser.rule("bracket", /^[\[\]\{\}]/)
tokeniser.rule("string", /^[^\r\n\[\]\{\}]+/)


exports.readFile = (fileName) => {
    const lines = tokeniser.tokenize(fs.readFileSync(fileName).toString()).map(element => element.trim()).filter(element => !element.match(/^$/))
    console.log(lines)
    let data = {}
    data.randomData = []
    let stack = [data]
    let active = data
    lines.forEach(line => {
        //Test if comma
        if(line.substr(0, 2) === "//") return
        //Test if value declaration
        const splitLine = line.split("=")
        if(splitLine.length === 2){
            active[splitLine[0].trim()] = splitLine[1].trim().replace(/^"|"$/g, '')
        }
        //
        else{
            if(line.substr(-1) === "["){
                active[line.substr(0, line.length - 1).trim()] = []
                stack.push(active[line.substr(0, line.length - 1).trim()])
                active = stack[stack.length - 1]
            } else if(line == "["){
                //todo: handle unammed Arrays
                //todo: unnammed Arrays werden nicht in den Stack gepuscht, da sie nur skalars haben
                throw "This has not been implemented! " + line
            } else if(line === "]" || line === "}"){
                active = stack[stack.length - 2]
                stack.pop()
            } else if(line == "{") {
                if (Array.isArray(active)) {
                    active.push({})
                    stack.push(active[active.length - 1])
                    active = active[active.length - 1]
                    active.randomData = []
                } else {
                    //todo: handle unnammed objects in obejcts (if that occurs)
                    throw "This has not been implemented!" + line
                }
            } else{
                //todo: handle links + other data
                if(Array.isArray(active)){
                    active.push(line)
                } else{
                    active.randomData.push(line)
                }
            }
        }
    })
    console.log(data)
    return data;
}