const express = require("express");
const app = express();
const port = process.env.PORT || 2410;
const orders = [];
const users = [{ email: "email@test.com", password: "12345678" }];
const {productsData} = require("./dataFile.js");
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.listen(port, () => {
  console.log(`Node app listening on port ${port}!`);
});

app.get("/products", function (req, res) {
  res.send(productsData);
});

app.get("/products/:category", function (req, res) {
  let category = req.params.category;
  let arr = productsData.filter((pr) => pr.category === category);
  res.send(arr);
});

app.get("/product/:id", function (req, res) {
  let id = +req.params.id;
  let product = productsData.find((pr) => pr.id === id);
  res.send(product);
});

app.post("/products", function (req, res) {
  let body = req.body;
  let maxId = productsData.reduce((acc, curr) => (curr.id > acc ? curr.id : acc), 0);
  let newId = maxId + 1;
  let newProduct = {
    id: newId,
    ...body,
  };
  productsData.push(newProduct);
  res.send(newProduct);
});

app.put("/products/:id", function (req, res) {
  let id = +req.params.id;
  let body = req.body;
  let index = productsData.findIndex((pr) => pr.id === id);
  if (index >= 0) {
    let updateProduct = { id: id, ...body };
    productsData[index] = updateProduct;
    res.send(updateProduct);
  } else {
    res.send("No Such Product Found");
  }
});

app.delete("/products/:id", function (req, res) {
  let id = +req.params.id;
  let index = productsData.findIndex((pr) => pr.id === id);
  if (index >= 0) {
    let deletedProduct = productsData.splice(index, 1);
    res.send(deletedProduct);
  } else {
    res.send("No Such Product Found");
  }
});

app.get("/orders", function (req, res) {
  res.send(orders);
});

app.post("/orders", function (req, res) {
  let body = req.body;
  let maxId = orders.reduce((acc, curr) => (curr.id > acc ? curr.id : acc), 0);
  let newId = maxId + 1;
  let newOrder = { id: newId, ...body };
  orders.push(newOrder);
  res.send(newOrder);
});

app.post("/login", function (req, res) {
  console.log(req.body)
  let email = req.body.email;
  let password =req.body.password;
  console.log("inside login");
  let user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    res.send({user:email});
  } else {
    res.status(401).send("Invalid login Credentials");
  }
});

app.post("/register", function (req, res) {
  let body = req.body;
  let newUser = { ...body };
  users.push(newUser);
  res.send(newUser);
});
