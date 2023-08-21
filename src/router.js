const express = require("express");
const isValidDomain = require('is-valid-domain');
const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

router.get("/search/:domain", searchController);

function searchController(req, res) {
    domain = req.params.domain;
    if (!isValidDomain(domain)) {
        console.log("URL inválida:", domain);
        res.status(400).send("URL inválida");
        return;
    }
    console.log("URL VALIDA:", domain);
    res.status(200).send("URL VALIDA");
}

module.exports = router;