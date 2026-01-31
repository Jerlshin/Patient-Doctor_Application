const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
    "severity":{type:String},
    "message":{type:String}
},{
    collection: "doctormessages"
});

module.exports = mongoose.model("messageSchema", messageSchema);