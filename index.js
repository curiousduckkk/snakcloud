require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const auth= require("./routes/authroutes");
const app = express();
const cors = require("cors");
const verifyJWT = require("./middlewares/jwt");

const mongoURI = process.env.DB_URI;

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

console.log(mongoURI);

// Connecting to mongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.use(auth);

app.get("/ping", verifyJWT, (_, res) => {
  res.status(200).json({ msg: "pong" });
});
app.listen(8080, () => {
  console.log("Server started at port: 8080");
});

