const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 80;
const google_apiKey = process.env.google_apiKey;

app.listen(PORT, () =>
  console.log(`Running on port: ${PORT}, GOOGLE Key: ${google_apiKey}`)
);
