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
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // todo: create new user with given name
  let user = new User(req.body);
  user = await user.save();

  // todo: send the newly created user back
  res.send(_.pick(user, ["_id", "username"]));
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  // todo: verify the user exists
  const user = await User.findById(req.params._id);
  if (!user) return res.status(400).send("invalid userId");

  // todo: validate data sent by user
  const { error } = validateExercise(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // todo: create an exercise
  const exercise = new Exercise(
    _.pick(req.body, ["description", "duration", "date"])
  );

  // todo: add exercise to the user
  user.log.push(exercise);
  await user.save();

  // todo:construct the response and return the newly created exercise
  const result = _.pick(user, ["_id", "username"]);
  const recentExercise = user["log"][user["log"].length - 1];
  result.description = recentExercise?.["description"];
  result.date = req.body.date
    ? new Date(req.body.date).toDateString()
    : new Date().toDateString();
  result.duration = parseInt(recentExercise?.["duration"]);
  res.send(result);
});

app.get("/api/users/:_id/logs", async (req, res) => {
  // todo: find the user
  const user = await User.findById(req.params._id);
  // todo: if no user found return an error
  if (!user) return res.status(404).send("no such user found!");
  // todo: otherwise return the user document

  const dateFrom = req.query.from ? new Date(req.query.from) : null;
  const dateTo = req.query.to ? new Date(req.query.to) : null;
  const limit = req.query.limit;

  let logs = user.log.map((x) => {
    const date = new Date(x.date).toDateString();
    return { description: x["description"], duration: x["duration"], date };
  });

  if (dateFrom && dateTo) {
    logs = logs.filter(
      (x) => new Date(x.date) >= dateFrom && new Date(x.date) <= dateTo
    );
  }

  if (dateFrom) {
    logs = logs.filter((x) => new Date(x.date) >= dateFrom);
  }

  if (dateTo) {
    logs = logs.filter((x) => new Date(x.date) <= dateTo);
  }
  if (limit) {
    logs = _.take(logs, limit);
  }

  const result = _.pick(user, ["_id", "username", "count"]);
  result.log = logs;

  res.send(result);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
