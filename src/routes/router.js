const express = require("express");
const router = express.Router();
const path = require("path");
const searchController = require("../controllers/searchController");

router.get("/search/:domain", searchController.search);

router.get("/", (req, res) => {
  const indexPath = path.join(__dirname, "..", "index.html");
  res.sendFile(indexPath);
});

module.exports = router;
