require("express-async-errors");
const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const { createToken } = require("../middlewares/auth");

const login = async (req, res) => {
  console.log("login içerisinde");

  const { email, password } = req.body;
  const userInfo = await user.findOne({ email });
  console.log(userInfo);
  if (!userInfo) throw new APIError("Email ya da şifre hatalıdır.", 401);

  const comparePassword = await bcrypt.compare(password, userInfo.password);
  console.log(comparePassword);
  if (!comparePassword) throw new APIError("Email ya da şifre hatalıdır.", 401);

  createToken(userInfo, res);
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
    });
};

const me = async (req, res) => {
  console.log("me içerisinde ");

  return new Response(req.user).success(res);
};

module.exports = { login, register, me };
