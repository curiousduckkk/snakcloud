const express = require("express");
const router = express();
const auth= require("../controllers/auth");
const upload = require("../controllers/upload");
const middleware = require("../middlewares/jwt");


router.post("/signup", auth.signup);
router.post("/login", auth.login);
router.post("/upload", middleware,upload.GetUploadURL);


module.exports= router;