const config = require('./index').default;

module.exports = {
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  host: config.database.host,
  dialect: config.database.dialect,
  port: config.database.port
};