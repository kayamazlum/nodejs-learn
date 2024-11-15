const APIError = require("../utils/errors");

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof APIError) {
    //instanceof : err'nin APIError sınıfına ait olup olmadıgını kontrol eder
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message,
    });
  }

  console.log(err);

  return res.status(500).json({
    success: false,
    message: "Hata var. Lütfen apinizi kontrol edin!",
  });
};

module.exports = errorHandlerMiddleware;
