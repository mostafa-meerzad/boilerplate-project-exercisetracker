const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb+srv://mostafa:${process.env.DBKEY}.nkbvvbe.mongodb.net/userExercises`
  )
  .then(() => {
    console.log("connected to db");
  })
  .catch((e) => {
    throw new Error(e);
  });
