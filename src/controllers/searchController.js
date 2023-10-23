const axios = require("axios");
const isValidDomain = require("is-valid-domain");
require("dotenv").config();
const google_apiKey = process.env.google_apiKey;
const google_cx = process.env.google_cx;
const google_leaks_cx = process.env.googleLeaks_cx;
const google_dorks = process.env.dorks_file;
const leaks_dorks = process.env.leaks_file;

const dns = require("dns");
const readline = require("readline");
const fs = require("fs");
const csvtojson = require("csvtojson");

function resolveDNS(domain, res) {
  return new Promise((resolve, reject) => {
    dns.resolve(domain, (err, addresses) => {
      if (err) {
        res.status(200).json({
          status: "error",
          msg: "Insira um dominio valido.",
          data: null,
        });
      } else {
        resolve(addresses[0]);
      }
    });
  });
}

async function search(req, res) {
  domain = req.params.domain;
  if (!isValidDomain(domain)) {
    res
      .status(200)
      .json({ status: "error", msg: "Insira um domínio válido!", data: [] });
    return;
  }
  const results = {
    google: [],
    shodan: [],
  };
  const ip = await resolveDNS(domain, res);

  const shodan_results = await shodanSearch(ip);

  const google_results = await googleSearch(domain);

  results.google = google_results;

  results.shodan = shodan_results[0];

  if (
    Object.keys(results.google).length > 0 ||
    Object.keys(results.shodan).length > 0
  ) {
    res.status(200).json({
      status: "success",
      msg: "Pesquisa realizada!",
      data: results,
    });
  } else {
    res.status(200).json({
      status: "error",
      msg: "Nenhum resultado encontrado para o domínio especificado.",
      data: null,
    });
  }
  return;
}

async function googleSearch(domain) {
  const results = {
    info: {},
    leaks: {},
  };

  const rl = readline.createInterface({
    input: fs.createReadStream(google_dorks),
    output: process.stdout,
  });

  for await (const line of rl) {
    let url = line.replace("_DOMAIN_", domain);

    try {
      const response = await axios.get(
        `https://www.googleapis.com/customsearch/v1?key=${google_apiKey}&cx=${google_cx}&q=${url}`
      );
      if (response.data && response.data.items) {
        results.info[url] = {
          query: response.data.items,
          total: response.data.searchInformation.formattedTotalResults,
        };
      } else {
        console.error(`Nenhum item encontrado para ${url}`);
      }
    } catch (error) {
      console.error(`Não foi possível completar a requisição para: ${url}`);
    }
  }
  if (leaks_dorks !== "" && leaks_dorks !== undefined) {
    const rl_leaks = readline.createInterface({
      input: fs.createReadStream(leaks_dorks),
      output: process.stdout,
    });

    for await (const line of rl_leaks) {
      let url = line.replace("_DOMAIN_", domain);

      try {
        const response = await axios.get(
          `https://www.googleapis.com/customsearch/v1?key=${google_apiKey}&cx=${google_leaks_cx}&q=${url}`
        );
        if (response.data && response.data.items) {
          results.leaks[url] = {
            query: response.data.items,
            total: response.data.searchInformation.formattedTotalResults,
          };
        } else {
          console.error(`Nenhum item encontrado para ${url}`);
        }
      } catch (error) {
        console.error(`Não foi possível completar a requisição para: ${url}`);
      }
    }
  }
  return results;
}

async function shodanSearch(ip) {
  try {
    const result = await axios.get(`https://louis.kim/api/shodan/ip?${ip}`);
    const jsonArray = await csvtojson().fromString(result.data);
    return jsonArray;
  } catch (error) {
    console.error("Erro na consulta Shodan:", error);
    throw error;
  }
}

module.exports = {
  search,
};
