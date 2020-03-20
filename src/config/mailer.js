const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "4c5f8aef6c7882",
    pass: "1ee16341aaa5d1"
  }
});
