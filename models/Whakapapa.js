const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create schema
const WhakapapaSchema = new Schema({
  data: {
    type: String
    // required: true
  },
  whanau: {
    type: String,
    required: true
  },
  passcode: {
    type: String,
    required: true
  },
  name_count: {
    type: Number
  },
  call_count: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Whakapapa = mongoose.model("whakapapa", WhakapapaSchema);
