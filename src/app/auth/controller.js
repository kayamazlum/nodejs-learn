require("express-async-errors");
const user = require("../users/model");
const bcrypt = require("bcrypt");
const APIError = require("../../utils/errors");
const Response = require("../../utils/response");
const {
  createToken,
  createTemporaryToken,
  decodedTemporaryToken,
} = require("../../middlewares/auth");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendMail");
const moment = require("moment");

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

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  const userInfo = await user.findOne({ email }).select("name lastname email");

  if (!userInfo) return new APIError("Geçersiz kullanıcı", 400);
  console.log("user info :  ", userInfo);

  const resetCode = crypto.randomBytes(3).toString("hex");
  console.log(resetCode);

  // await sendEmail({
  //   from: process.env.EMAIL_USER,
  //   to: userInfo.email,
  //   subject: "Şifre Sıfırlama",
  //   text: `Şifre sıfırlama kodunuz: ${resetCode}`,
  // });

  await user.updateOne(
    { email },
    {
      reset: {
        code: resetCode,
        time: moment(new Date())
          .add(15, "minute")
          .format("YYYY-MM-DD HH:mm:ss"),
      },
    }
  );

  return new Response(true, "Lütfen mail kutunuzu kontrol ediniz.").success(
    res
  );
};

const resetCodeCheck = async (req, res) => {
  const { email, code } = req.body;

  const userInfo = await user
    .findOne({ email })
    .select("_id name lastname email reset");

  if (!userInfo) throw new APIError("Geçersiz kod", 401);

  const dbTime = moment(userInfo.reset.time);
  const nowTime = moment(new Date());

  const timeDiff = dbTime.diff(nowTime, "minutes");
  console.log("Zaman farkı: ", timeDiff);
  console.log("userInfo: ", userInfo);

  if (timeDiff <= 0 || userInfo.reset.code !== code) {
    throw new APIError("Geçersiz kod", 401);
  }

  const temporaryToken = await createTemporaryToken(
    userInfo._id,
    userInfo.email
  );

  return new Response(
    { temporaryToken },
    "Şifrenizi sıfırlayabilirisiniz"
  ).success(res);
};

const resetPassword = async (req, res) => {
  const { password, temporaryToken } = req.body;
  const decoededToken = await decodedTemporaryToken(temporaryToken);
  console.log("decodedToken", decodedToken);

  const hashPassword = await bcrypt.hash(password, 10);
  await user.findByIdAndUpdate(
    { _id: decoededToken._id },
    { reset: { code: null, time: null }, password: hashPassword }
  );

  return new Response(decoededToken, "Şifre sıfırlama başarılı").success(res);
};

module.exports = {
  login,
  register,
  forgetPassword,
  resetCodeCheck,
  resetPassword,
};
