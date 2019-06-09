const sgMail = require('@sendgrid/mail'),
      config = require('../utils/config');
sgMail.setApiKey(config.email_api_key);

const sendWelcomeEmail = (email, name)=>{
  sgMail.send({
    to: email,
    from: '10vpetyr.yonkov@gmail.com',
    subject: `Hello, ${name}! Welcome aboard.`,
    text: 'We are glad you are joining us!'
  });
};

const sendCancellationEmail = (email, name)=>{
  sgMail.send({
    to: email,
    from: '10vpetyr.yonkov@gmail.com',
    subject: `We are sad to see you go, ${name}! :((((`,
    text: 'What could we have done to keep you as a user?'
  });
};
module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
};
