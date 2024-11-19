const router = require("express").Router();
const multer = require("multer");
const upload = require("../middlewares/lib/upload");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const auth = require("../app/auth/router");
const user = require("../app/users/router");

router.use(auth);
router.use(user);

router.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError)
      throw new APIError(
        "Resim yüklenirken hata çıktı (multer kaynaklı) : ",
        err
      );
    else if (err) throw new APIError("Resim yüklenirken hata çıktı : ", err);
    else return new Response(req.savedImages, "Yükleme başarılı").success(res);
  });
});

module.exports = router;
