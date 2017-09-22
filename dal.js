const HTTPError = require('node-http-error')

const { pathOr } = require('ramda')

const test = callback => {
  callback(null, 'dal is ok')
}

const createEmail = (contact, callback) => {
  // const firstName = pathOr('', ['firstName'], contact)
  // const lastName = pathOr('', ['lastName'], contact)
  // const email = pathOr('', ['email'], contact)
  // const profileId = pathOr('', ['profileId'], contact)

  createDoc(contact, callback)
}

function createDoc(doc, callback) {
  db.put(doc).then(res => callback(null, res)).catch(err => callback(err))
}

const dal = {
  test,
  createEmail
}

module.exports = dal
