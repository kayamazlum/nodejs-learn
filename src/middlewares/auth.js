const jwt = require("jsonwebtoken");
const APIError = require("../utils/errors");
const { me } = require("../controller/auth.controller");
const user = require("../models/user.model");

const createToken = async (user, res) => {
  const payload = {
    sub: user._id,
    name: user.name,
  };

  const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    algorithm: "HS512",
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return res.status(201).json({
    success: true,
    token,
    message: "Token oluşturma başarılı",
  });
};

const tokenCheck = async (req, res, next) => {
  console.log("token check içerisinde");

  const headerToken =
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ");

  console.log(headerToken);

  if (!headerToken) {
    throw new APIError("Geçersiz oturum. Lütfen oturum açın", 401);
  }

  const token = req.headers.authorization.split(" ")[1];

  await jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoeded) => {
    if (err) throw new APIError("Geçersiz token", 401);

    const userInfo = await user
      .findById(decoeded.sub)
      .select("_id name lastname email");

    if (!userInfo) throw new APIError("Geçersiz token - Kullanıcı yok", 401);

    req.user = userInfo; //req i anlamadım
  });
  next();
};

createTemporaryToken = async (userId, email) => {
  const payload = {
    sub: userId,
    email,
  };

  const token = await jwt.sign(payload, process.env.JWT_TEMPORARY_KEY, {
    algorithm: "HS512",
    expiresIn: process.env.JWT_TEMPORARY_EXPIRES_IN,
  });

  return "Bearer " + token;
};

const decodedTemporaryToken = async (temporaryToken) => {
  const token = temporaryToken.split(" ")[1];
  let userInfo;
  await jwt.verify(
    token,
    process.env.JWT_TEMPORARY_KEY,
    async (err, decoded) => {
      if (err) throw new APIError("Geçersiz token", 401);

      userInfo = await user
        .findById(decoded.sub)
        .select("_id name lastname email");

      if (!userInfo) throw new APIError("Geçersiz token", 401);
    }
  );
  return userInfo;
};

module.exports = {
  createToken,
  tokenCheck,
  createTemporaryToken,
  decodedTemporaryToken,
};
// tekrar
