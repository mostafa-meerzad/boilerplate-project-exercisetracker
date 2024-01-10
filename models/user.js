const mongoose = require("mongoose");
const { exerciseSchema } = require("./exercise");
const Joi = require("joi");

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

const User = mongoose.model("User", userSchema);

function validate(user) {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(100),
  });

  return schema.validate(user);
}
module.exports.User = User;
module.exports.validateUser = validate;
