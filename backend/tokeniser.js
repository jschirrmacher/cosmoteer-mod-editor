module.exports = (str, rules) => {
    let tokens
    tokens = []

    while (str) {
        if (!rules.some(rule => {
            let matches
            if (matches = str.match(rule.regex)) {
                tokens.push({type: rule.type, matches})
                str = str.substr(matches[0].length)
                return true
            }
        })) {
            throw 'Did not find any tokens'
        }
    }

    return tokens
}
