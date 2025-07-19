const mongoose = require("mongoose");

module.exports = mongoose.model("Member", new mongoose.Schema({
  callsign: String,
  name: String,
  rank: String,
  status: String
}));
