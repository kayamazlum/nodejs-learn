const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
require("./src/db/dbConnection.js");
const router = require("./src/routers");
const errorHandlerMiddleware = require("./src/middlewares/errorHandler.js");
const cors = require("cors");
const corsOptions = require("./src/helpers/corsOptions.js");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");
const apiLimiter = require("./src/middlewares/rateLimit.js");

const app = express();
const port = process.env.PORT || 5001;

// middlewares
app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(__dirname));

app.use(cors(corsOptions)); //tekrar et

app.use("/api", apiLimiter);

app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

app.use("/api", router);

app.get("/", (req, res) => {
  res.json({
    message: "ana sayfaaaaaa",
  });
});

//hata yakalama yeri
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server ${port} portundan çalışıyor...`);
});
