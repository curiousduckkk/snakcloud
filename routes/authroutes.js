const express = require("express");
const router = express();
const auth= require("../controllers/auth");
const upload = require("../controllers/upload");
const middleware = require("../middlewares/jwt");


router.post("/signup", auth.signup);
router.post("/login", auth.login);
router.get("/upload", middleware,upload.GetUploadURL);
router.post("/uploadfile", middleware, upload.UploadFile);
router.get("/download/:id", middleware, upload.DownloadFile);
router.post("/access", middleware, upload.Access);

module.exports= router;