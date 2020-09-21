const mongoose=require("mongoose");

const ApplicationSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    strict: false
});


module.exports = mongoose.model("Application", ApplicationSchema);


