const mongoose = require("mongoose");

// "mongodb+srv://mostafa:mEGKue60u2QV8KCr@cluster0.nkbvvbe.mongodb.net/userExercises"
// module.exports = function () {
mongoose
  .connect("mongodb://localhost:27017/userExercises")
  .then(() => {
    console.log("connected to db");
  })
  .catch((e) => {
    throw new Error(e);
  });
// };
