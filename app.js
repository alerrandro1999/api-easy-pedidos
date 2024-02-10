const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const productController = require("./src/controller/productController");
const loginController = require("./src/controller/loginController");

app.use(express.json());
app.use(cors());

app.get("/api/v1", (req, res) => {
  res.status(200).json({ msg: "Bem vindo a nossa api!" });
});

app.post("/api/v1/auth/login", loginController.authLogin);
app.get("/api/v1/products", productController.getProducts);

app.listen(3000);
