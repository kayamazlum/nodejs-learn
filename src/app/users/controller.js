const Response = require("../../utils/response");

const me = async (req, res) => {
  console.log("me içerisinde ");

  return new Response(req.user).success(res);
};

module.exports = {
  me,
};
