const express = require("express");
const app = express();
const cors = require("cors");
const { validateUser, User } = require("./models/user");
require("dotenv").config();
require("./startup/db");
const _ = require("lodash");
const { validateExercise, Exercise } = require("./models/exercise");

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/users", async (req, res) => {
  // todo: get all users and send with "id" and "username" properties
  const users = await User.find().select("_id username");
  res.send(users);
});

app.post("/api/users/", async (req, res) => {
  // todo: validate userName sent from client
  // todo: create new user with given name
  // todo: send the newly created user back
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = new User(req.body);
  user = await user.save();
  res.send(_.pick(user, ["_id", "username"]));
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  // todo: verify the user exists
  // todo: validate data sent by user
  // todo: create an exercise
  // todo: add exercise to the user
  // todo: return the newly created exercise

  const user = await User.findById(req.params._id);
  if (!user) return res.status(400).send("invalid userId");

  const { error } = validateExercise(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // user.log.push(exercise);
  await user.save();
  const result = _.pick(user, ["username", "_id"]);
  // const recentExercise = user["log"][user["log"].length - 1];
  // result.description = req.body.description;
  // result.date = req.body.date;
  // result.duration = req.body.duration;
  // result.description = recentExercise["description"];
  // result.date = recentExercise["date"];
  // result.duration = recentExercise["duration"];
  res.send(result);
  // res.send(user);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
