const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  description: String,
  duration: Number,
  date: {
    type: Date,
    default: () => new Date().toDateString()
  },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports.Exercise = Exercise;
module.exports.exerciseSchema = exerciseSchema;
