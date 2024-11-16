const multer = require("multer");
const path = require("path");
const fs = require("fs");

const fileFilter = (req, file, cb) => {
  const allowedMimeType = ["image/jpg", "image/gif", "image/jpeg", "image/png"];

  if (!allowedMimeType.includes(file.mimetype)) {
    cb(new Error("Bu resim tipi desteklenmiyor."), false);
  }
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const rootDir = path.dirname(require.main.filename);
    console.log("require.main.filename :", require.main.filename);

    fs.mkdirSync(path.join(rootDir, "/public/uploads"), { recursive: true }); //dosya olusur
    cb(null, path.join(rootDir, "/public/uploads")); //olusan dosyaya yukleme yapar
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];

    if (!req.savedImages) req.savedImages = [];

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    let url = `image_${uniqueSuffix}.${extension}`;

    req.savedImages = [...req.savedImages, path.join(url)];

    cb(null, url);
  },
});

const upload = multer({ storage, fileFilter }).array("images"); //array yerine single = tekli yukleme yapar

module.exports = upload;
