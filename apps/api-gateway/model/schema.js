const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
    "name":{type:String},
    "profession":{type:String},
    "address":{type:String},
    "qualifications":{type:String},
    "image": {type:String},
    "location":{type:String},
    "email":{
        type:String,
    },
    "password":{
        type:String,
        required:true
    }
},{
    collection: "doctors"
});

module.exports = mongoose.model("studentSchema", studentSchema);