const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT;
const GKEY = process.env.GOOGLE;
const SKEY = process.env.SHODAN;

app.listen(PORT, () => console.log(`Running on port: ${PORT}, GOOGLE Key: ${GKEY}, SHODAN Key: ${SKEY}`));