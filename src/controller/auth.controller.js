require("express-async-errors");
const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");

const login = async (req, res) => {
  console.log(req.body);
  return res.json(req.body);
};
const register = async (req, res) => {
  const { email } = req.body;
  // req.body.email //bu şekilde de emaili alabiliriz

  const userCheck = await user.findOne({ email });
  // const userCheck = awair user.findOne({email: req.body.email})

  if (userCheck) {
    throw new APIError("Bu mail zaten kullanılıyor.", 401);
  }

  req.body.password = await bcrypt.hash(req.body.password, 10);
  console.log("hash sifre : ", req.body.password);

  const userSave = new user(req.body);
  await userSave
    .save()
    .then((data) => {
      return new Response(data, "Kayıt başarılı.").created(res);
    })
    .catch((err) => {
      throw new APIError("Kullanıcı kayıt edilemedi!", 400);
      console.log(err);
    });
};

module.exports = { login, register };
