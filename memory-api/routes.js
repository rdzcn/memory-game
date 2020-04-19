const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ response: "listening to connections on landing" }).status(200);
});

router.get("/games/:id", (req, res) => {
  res.send({ response: "listening to connections on games" }).status(200);
});

module.exports = router;