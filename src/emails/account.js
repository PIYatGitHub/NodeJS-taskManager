const sgMail = require('@sendgrid/mail'),
      config = require('../utils/config');
sgMail.setApiKey(config.email_api_key);

sgMail.send({
  to:'10vpetyr.yonkov@gmail.com',
  from: '10vpetyr.yonkov@gmail.com',
  subject: '@Echo',
  text: 'does it send to you???'
});