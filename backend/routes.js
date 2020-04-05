const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ response: "listening to connections" }).status(200);
});

module.exports = router;