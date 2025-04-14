const jsyaml = require('js-yaml')
const fs = require('node:fs')
const { join } = require('node:path')

const yaml = fs.readFileSync(join(__dirname, '../../db.config.yaml'), 'utf-8')
const config = jsyaml.load(yaml)

module.exports = {
    port: config.port,
    dburi: `mysql://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.database}`,
    username: config.db.user,
    password: config.db.password,
    key: config.key_word,
    config
}
