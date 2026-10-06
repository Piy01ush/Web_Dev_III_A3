
const express = require("express");

const { connection } = require("./db");

const { productRouter } = require("./routes/product.route");

const { errorMiddleware } = require("./middleware/error.middleware");



const app = express();



app.use(express.json());


app.use("/api/products", productRouter);



app.get("/", (req, res) => {
  res.send({
    msg: "Welcome to Inventory Management System",
  });
});



app.use(errorMiddleware);



app.listen(8080, async () => {
  try {

    
    await connection;

    console.log("DB Connected");

  } catch (error) {

    console.log(error);

  }

  console.log("Server started");
});