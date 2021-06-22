const transporter = require("./mail_transporter");


const fromEmail = "Imperialcapital16@gmail.com";


const sendMail = (toEmails,body) => {
    
    const toEmail = toEmails.join(",");
    let options = {
        from:fromEmail,
        to: toEmail,
        subject:body.subject,
        html:body.html || body.text
    }
    return transporter.sendMail(options);
}

module.exports = {
    sendMail
}

