module.exports = {
    apps : [{
        name           : "backend",
        script         : "index.js",
        watch          : true,
        "ignore_watch" : ['mods'],
        env: {
            "LOG_LEVEL": "debug",
            "NODE_ENV": "development"
        },
        env_production : {
            "NODE_ENV": "production"
        }
    }]
}
