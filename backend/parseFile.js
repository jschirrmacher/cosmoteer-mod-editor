/**
 * Created by Jasper on 12.07.2017.
 */
"use strict";
const fs = require("fs")
const tokeniser = require("node-tokenizer")

tokeniser.rule("whitespace", /^[\r\n\t ]+/)
tokeniser.rule("arrayStart", /^[a-zA-Z]+\s*\[/)
tokeniser.rule("bracket", /^[\]\{\}]/)
tokeniser.rule("string", /^[^\r\n\[\]\{\}]+/)


exports.readFile = (fileName) => {
    const lines = tokeniser.tokenize(fs.readFileSync(fileName).toString()).map(element => element.trim()).filter(element => !element.match(/^$/))
    console.log(lines)
    let data = {}
    let counter = 0
    let stack = [data]
    let active = data
    lines.forEach(line => {
        //Test if comma
        if(line.substr(0, 2) === "//") return
        //Test if value declaration
        const splitLine = line.split("=")
        if(splitLine.length === 2){
            active[splitLine[0].trim()] = splitLine[1].trim()
        }
        //
        else{
            if(line.substr(-1) === "["){
                active[line.substr(0, -1)] = []
                stack.push(active[line.substr(0, -1)])
                active = stack[stack.length - 1]
            } else if(line === "]"){
                active = stack[stack.length - 2]
                stack.pop()
            } else if(line == "{"){

            }
        }
        counter++
    })
    console.log(data)
    return data;
}