const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 8080;

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_KEY,
    }}
);

transporter.verify((error, success) => {
  if (error) {
    console.log('Error with transporter configuration:', error);
  } else {
    console.log('Server is ready to take messages:', success);
  }
});


app.get('/', (req, res) => {
  res.status(200).send({ success: true, message: 'Working', info });
});

app.post('/email', (req, res) => {
  const { name, from, subject, message  } = req.body;

  const text = "A mail from: " + from + "\n\n" + "and it reads:\n" + message;

  const mailOptions = {
    from: {
        name: name,
        address: process.env.MAIL_ID 
    }, 
    to: "arjunce15@gmail.com",
    subject: subject, 
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send({ success: false, message: 'Failed to send email', error });
    }
    res.status(200).send({ success: true, message: 'Email sent successfully', info });
  });
});


app.listen(port, '0.0.0.0', () => {
  console.log(`Email service listening at http://0.0.0.0:${port}`);
});
