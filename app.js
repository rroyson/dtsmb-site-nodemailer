require('dotenv').config()
const nodemailer = require('nodemailer')
const xoauth2 = require('xoauth2')

let transporter = nodemailer.createTransport({
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
  from: 'Rob <rroyson2@gmail.com>',
  to: 'rroyson2@gmail.com',
  subject: 'nodemailer test',
  text: 'Hello Mail'
}

transporter.sendMail(mailOptions, function(err, res) {
  if (err) {
    return console.log('Error', err)
  } else {
    console.log('Success')
    console.log(res)
  }
})
