const nodemailer = require("nodemailer");

let account = {
    user: "imperialcapitalllc7@gmail.com",
    pass: "Timothy@1990"
};

const transporter = nodemailer.createTransport({
    auth: account,
    service: "gmail"
});

module.exports = transporter

