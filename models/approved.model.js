const mongoose = require("mongoose");

const ApprovedSchema = new mongoose.Schema({
  status1: {
    type: String,
  },
  status2: {
    type: String,
  },
  studentID: {
    type: String,
  },
  name: {
    type: String,
  },
});

module.exports = mongoose.model("Approve", ApprovedSchema);
