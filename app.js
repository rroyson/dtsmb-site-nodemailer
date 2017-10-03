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
const checkReqFields = require('./components/check-required-fields')
const checkFields = checkReqFields(['name', 'email', 'date'])

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

  const field = pathOr(null, ['body'], req)
  const fieldResults = checkFields(field)

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
    subject: `New Wedding Inquiry`,
    text: `
      Name: ${contact.name}
      Email: ${contact.email}
      Date of event: ${contact.date}
      Venue Name: ${contact.venueName}
      Venue Location: ${contact.venueLocation}
      Venue Address: ${contact.address}
      Comments: ${contact.comments}
    `
  }

  if (fieldResults.length > 0) {
    return next(
      new HTTPError(400, 'Missing required fields', { fields: fieldResults })
    )
  } else {
    transporter.sendMail(mailOptions, function(err, result) {
      console.log('mailOptions', mailOptions)
      console.log('err', err)
      console.log('result', result)
      if (err) {
        return next(new HTTPError(err.status, err.message, err))
      } else {
        res.status(201).send(result)
      }
      return res.end()
    })
  }

  //return res.end()
})

///Middleware

app.use(function(err, req, res, next) {
  console.log(req.method, req.path, err)
  res.status(err.status || 500)
  res.send(err)
})

app.listen(port, () => console.log('Api is up on port: ', port))
