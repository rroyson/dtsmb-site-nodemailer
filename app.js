require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const dal = require(`./dal`)
const port = process.env.PORT || 4000
const HTTPError = require('node-http-error')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const xoauth2 = require('xoauth2')
const { pathOr } = require('ramda')

app.use(cors({ credentials: true }))

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send('Welcome to the Charleston Wedding Band API.')
})

////////////////
////NODEMAILER
///////////////

app.post('/contact', function(req, res, next) {
  const contact = pathOr(null, ['body'], req)
  console.log(contact)

  // const fieldResults = checkVenueFields(venue)
  //
  // if (fieldResults.length > 0) {
  //   return next(
  //     new HTTPError(400, 'Missing required fields', { fields: fieldResults })
  //   )
  // }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'rroyson2@gmail.com',
      clientId: process.env.REACT_APP_API_AUTH_ID,
      clientSecret: process.env.REACT_APP_API_AUTH_SECRET,
      refreshToken: process.env.REACT_APP_API_AUTH_REFRESH
    }
  })

  const mailOptions = {
    from: 'The Charleston Wedding Band <rroyson2@gmail.com>',
    to: 'rroyson2@gmail.com',
    subject: `Inquiry from ${contact.name}`,
    text: `${contact.name}`
  }

  transporter.sendMail(mailOptions, function(err, res) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(201).send(result)
  })
  return res.end()
})

// let transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     type: 'OAuth2',
//     user: 'rroyson2@gmail.com',
//     clientId: process.env.REACT_APP_API_AUTH_ID,
//     clientSecret: process.env.REACT_APP_API_AUTH_SECRET,
//     refreshToken: process.env.REACT_APP_API_AUTH_REFRESH
//   }
// })
//
// const mailOptions = {
//   from: 'Rob <rroyson2@gmail.com>',
//   to: 'rroyson2@gmail.com',
//   subject: 'nodemailer test',
//   text: 'Hello Mail'
// }
//
// transporter.sendMail(mailOptions, function(err, res) {
//   if (err) {
//     return console.log('Error', err)
//   } else {
//     console.log('Success')
//     console.log(res)
//   }
// })

///Middleware

app.use(function(err, req, res, next) {
  console.log(req.method, req.path, err)
  res.status(err.status || 500)
  res.send(err)
})

app.listen(port, () => console.log('Api is up on port: ', port))
