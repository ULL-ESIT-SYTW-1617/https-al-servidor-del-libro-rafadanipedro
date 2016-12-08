const Sequelize = require('sequelize')

module.exports = db => db.define('user', {
  email: Sequelize.STRING,
  password: Sequelize.STRING
})