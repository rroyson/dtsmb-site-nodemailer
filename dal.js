const HTTPError = require('node-http-error')


const test = callback => {
  callback(null,"dal is ok")
}

const dal = {
  test
}

module.exports = dal