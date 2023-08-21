const express = require("express");

const router = express.Router();

router.get("/search", (request, response) => response.status(200).send("Hello World"));

module.exports = router;