const mongoose = require('mongoose');
const config=require("./config");


let mongoURL = (process.env.NODE_ENV === "production") ?
                 config.MONGO_DB_URL:config.MONGO_DEV_URL;

                 console.log(mongoURL);
const connection = mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})


module.exports = connection;

