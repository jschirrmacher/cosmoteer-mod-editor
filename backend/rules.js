module.exports = [
    {type: "comment", regex: /^\s*\/\/[^\n]*/},
    {type: "definition", regex: /^\s*(\w+)\s*=((?:[^\n]+\\\n)*)[^\n]+/},
    {type: "arrayStart", regex: /^\s*(\w*)\s*\[/},
    {type: "arrayEnd", regex: /^\s*\]/},
    {type: "objectStart", regex: /^\s*(\w*)\s*\{/},
    {type: "objectEnd", regex: /^\s*\}/},
    {type: "line", regex: /^.+$/},
    {type: "emptyLine", regex: /^\n*/}
]
