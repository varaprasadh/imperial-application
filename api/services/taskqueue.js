// const kue=require("kue");
const mongoose=require("mongoose");
const url=require("url");
const {uploadImages} =require("./ImageService");
const Application=require("../models/Application");
const {sendMail}=require("./mailsender")



const OWNER_MAILS = [
    "iimperialcapital@gmail.com",
    "Imperialcapital16@gmail.com"
];
const OWNER_MAIL_CONTENT={
    subject:"New Application Request Received!",
    text:`New Applicatoin Request Received,Please check the dashboard`
}



const CLIENT_MAIL_CONTENT={
  subject:"Sign Up Alert",
  text:`

        Account Opening Request.

        Thank you
        for your interest in Imperial Capital


        We have received your registration information.We will notify you once the

        information has been verified by Imperial Capital personnel.

        Thank you


        Sincerely


        Imperial Capital, LLC Management
        info@imperialcapital.co.com
  `,
  html:`
   <strong>Account Opening Request</strong>
   <br/>
   <br/>
   Thank you for your interest in Imperial Capital.
   <br/>
   <br/>
   We have received your registration information.
   <br/>
   <br/>
   We will notify you once the information has been verified by Imperial Capital personnel.
   <b>Thank you</b>
   <br/>
   <br/>
   Sincerely
   <br/>
   Imperial Capital, LLC Management <br/>
   <a href="mailto:info@imperialcapital.co.com">info@imperialcapital.co.com</a>
  `
}


// const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
// var redisUrl = url.parse(REDIS_URL);
// var redisOptions = {
//     port: redisUrl.port,
//     host: redisUrl.hostname,
//     options: {
//         disableSearch: false
//     }
// };
// if (redisUrl.auth) {
//     redisOptions['auth'] = redisUrl.auth.split(":")[1];
// }

// const queue = kue.createQueue({
//     redis: redisOptions
// });


const handleJob = async (job, done) => {
    console.log("trying to create application...");
    const body = job.data.body;
    const files = job.data.files;
    try {
        const meta = await uploadImages(files);
        const newApplication = new Application({
            ...body,
            files: meta || []
        });
        await newApplication.save();
        console.log("task completed");
        console.log("sending mails");

        await sendMail(OWNER_MAILS, OWNER_MAIL_CONTENT);
        console.log("notified owner");
        //send mail to client again
        const client_email = body["24"] || "";
        console.log("client email", client_email);
        if (client_email.trim() !== "") {
            await sendMail([client_email], CLIENT_MAIL_CONTENT, true);
            console.log("notified client");
        }

        done();
    } catch (err) {
        console.log("err at queue", err);
        done(err);
    }
};


// queue.process("application", handleJob);

module.exports = {
    handleJob
};

