const mongoose = require("mongoose");
const { exerciseSchema } = require("./exercise");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 100,
    required: true,
  },
  log: [exerciseSchema],
});

userSchema.virtual("count").get(function () {
  return this.log.length;
});

module.exports = mongoose.model("User", userSchema);
