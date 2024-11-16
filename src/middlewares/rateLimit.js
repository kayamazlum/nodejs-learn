const rateLimit = require("express-rate-limit");

const allowList = ["::1"];

const apiLimiter = rateLimit({
  WindowMs: 15 * 60 * 1000, //15dk
  max: (req, res) => {
    console.log("api url : ", req.url);
    console.log("api ip : ", req.ip);

    if (req.url === "/login" || req.url === "/register") return 5;
    else return 100;
  },
  message: {
    success: false,
    message: "Çok fazla istekte bulundunuz.",
  },
  //   skip: (req, res) => allowList.includes(req.ip),
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

module.exports = apiLimiter;
