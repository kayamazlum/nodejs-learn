const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
require("./src/db/dbConnection.js");

const app = express();
const port = process.env.PORT || 5001;

app.get("/", (req, res) => {
  res.json({
    message: "ana sayfaaaaaa",
  });
});

app.listen(port, () => {
  console.log(`Server ${port} portundan çalışıyor...`);
});
