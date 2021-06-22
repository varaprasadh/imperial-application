const { sendMail  } = require('./mailsender');

sendMail(["varaprasadh.dev@gmail.com"], {
    subject: "test",
    html: "<h1>TEST</h1>"
});
