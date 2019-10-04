const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

// @route   POST api/form
// @desc    send feedback
// @access  Public
router.post("/", (req, res) => {
  console.log("backend feedback form: ", req.body);

  nodemailer.createTestAccount((err, account) => {
    const htmlEmail = `
    <h3>Feedback Form<h3>
    <ul>
    <li>Subject: ${req.body.subject}</li>
    <li>From: ${req.body.email}</li>
    </ul>
    <p>Message: ${req.body.comments}</p>
    `;

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "braulio22@ethereal.email",
        pass: "zRDnjtc6aqMMKp1CWE"
      }
    });

    let mailOptions = {
      from: "feedback@whakapapa.io",
      to: "braulio22@ethereal.email",
      replyTo: req.body.email,
      subject: req.body.subject,
      text: req.body.comments,
      html: htmlEmail
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.log(err);
      }

      console.log("Message sent: %s", info.text);
      console.log("Message URL: %s", nodemailer.getTestMessageUrl(info));
    });
  });
});

module.exports = router;
