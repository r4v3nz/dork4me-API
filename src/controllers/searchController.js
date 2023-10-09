const axios = require("axios");
const isValidDomain = require("is-valid-domain");
require("dotenv").config();
const google_apiKey = process.env.google_apiKey;
const google_cx = process.env.google_cx;
const shodan_apiKey = process.env.shodan_apiKey;

function search(req, res) {
  domain = req.params.domain;
  if (!isValidDomain(domain)) {
    res
      .status(200)
      .json({ status: "error", msg: "Insira um domínio válido!", data: [] });
    return;
  }
  googleSearch(domain, res);
}

function googleSearch(domain, res) {
  axios
    .get(
      `https://www.googleapis.com/customsearch/v1?key=${google_apiKey}&cx=${google_cx}&q=site:${domain}`
    )
    .then((response) => {
      items = response.data.items;
      res.status(200).json({
        status: "success",
        msg: "Pesquisa realizada!",
        data: items,
      });
    })
    .catch((error) => {
      res.status(200).json({
        status: "error",
        msg: "Houve um erro inesperado, contate um administrador!",
        data: [],
      });
    });
}

module.exports = {
  search,
};
