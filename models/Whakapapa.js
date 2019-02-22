const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create schema
const WhakapapaSchema = new Schema({
  data: {
    type: String,
    required: true
  },
  passcode: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Whakapapa = mongoose.model("whakapapa", WhakapapaSchema);
