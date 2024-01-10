const Joi = require("joi");
const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  description: String,
  duration: Number,
  date: {
    type: Date,
    default: () => new Date().toDateString(),
  },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

function validate(exercise) {
  const schema = Joi.object({
    description: Joi.string().required(),
    duration: Joi.number().required().positive(),
    date: Joi.date(),
  });

  return schema.validate(exercise);
}

module.exports.Exercise = Exercise;
module.exports.exerciseSchema = exerciseSchema;
module.exports.validateExercise = validate;
