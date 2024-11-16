const router = require("express").Router();
const multer = require("multer");
const upload = require("../middlewares/lib/upload");

const auth = require("./auth.routes");
const APIError = require("../utils/errors");
const Response = require("../utils/response");

router.use(auth);

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
