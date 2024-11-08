const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
require("./src/db/dbConnection.js");
const router = require("./src/routers");

const app = express();
const port = process.env.PORT || 5001;

// middlewares
app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

app.use("/api", router);

app.get("/", (req, res) => {
  res.json({
    message: "ana sayfaaaaaa",
  });
});

app.listen(port, () => {
  console.log(`Server ${port} portundan çalışıyor...`);
});
