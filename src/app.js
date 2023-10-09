/* eslint-disable linebreak-style */
const express = require("express");
const router = require("./routes/router");
const app = express();

const $ = require("jquery");
global.$ = global.jQuery = $;

app.use(router);

module.exports = app;
