const mongoose = require("mongoose");

const schema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
  },
  isdone: {
   type: Boolean,
  },
});

module.exports = mongoose.model("Task", schema);
