const user = require("../models/user.model");
const bcrypt = require("bcrypt");

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
    console.log("Bu mail zaten kullanılıyor.");
  }

  req.body.password = await bcrypt.hash(req.body.password, 10);

  console.log(req.body);
};

module.exports = { login, register };
