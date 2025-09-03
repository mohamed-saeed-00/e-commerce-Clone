// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require("nodemailer");

const handelMail = async (options) => {
  // create the transporter
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    scure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  //   define email options like(from,to,subject,email content)
  const emailOptions = {
    from: "e-commerce <mohamedsaeedo302@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(emailOptions);
};

module.exports = handelMail;
