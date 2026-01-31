const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  document: {
    type: String,
    required: true,
  },
  // You can add more fields as needed
});

module.exports = mongoose.model("Document", documentSchema);
