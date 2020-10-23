const mongoose = require('mongoose');
const thingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model("Thing", thingSchema)