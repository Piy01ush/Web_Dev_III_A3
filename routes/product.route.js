const express = require("express");
const { productModel } = require("../models/product.model");

const productRouter = express.Router();


productRouter.get("/", async (req, res) => {
  try {
    let { category, sort, page = 1, limit = 10 } = req.query;

    let filter = category ? { category } : {};

    let products = await productModel
      .find(filter)
      .sort(sort || "name")
      .skip((page - 1) * limit)
      .limit(limit);

    res.send({
      total: await productModel.countDocuments(filter),
      page,
      limit,
      products
    });
  } catch (error) {
    res.send({ msg: "Something went wrong" });
  }
});


productRouter.post("/", async (req, res) => {
  try {
    let product = new productModel(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.send({ msg: "Something went wrong" });
  }
});

// Low stock
productRouter.get("/low-stock", async (req, res) => {
  try {
    let products = await productModel.find({
      $expr: { $lte: ["$quantity", "$reorderLevel"] }
    });

    res.send({ count: products.length, lowStockItems: products });
  } catch (error) {
    res.send({ msg: "Something went wrong" });
  }
});


productRouter.get("/summary", async (req, res) => {
  try {
    let summary = await productModel.aggregate([
      {
        $group: {
          _id: "$category",
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalStockValue: {
            $sum: { $multiply: ["$price", "$quantity"] }
          },
          avgPrice: { $avg: "$price" }
        }
      }
    ]);

    res.send({ categories: summary.length, summary });
  } catch (error) {
    res.send({ msg: "Something went wrong" });
  }
});


productRouter.patch("/:id/stock", async (req, res) => {
  try {
    let product = await productModel.findById(req.params.id);

    if (!product)
      return res.send({ msg: "Product not found" });

    product.quantity += req.body.change;

    if (product.quantity < 0)
      return res.send({ msg: "Stock cannot be negative" });

    await product.save();

    res.send({ msg: "Stock updated", product });
  } catch (error) {
    res.send({ msg: "Something went wrong" });
  }
});

productRouter.get("/:id", async (req, res) => {
  try {
    let product = await productModel.findById(req.params.id);
    res.send(product);
  } catch (error) {
    res.send({ msg: "Something went wrong" });
  }
});


productRouter.put("/:id", async (req, res) => {
  try {
    let product = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.send(product);
  } catch (error) {
    res.send({ msg: "Something went wrong" });
  }
});


productRouter.delete("/:id", async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    res.send({ msg: "Product deleted" });
  } catch (error) {
    res.send({ msg: "Something went wrong" });
  }
});

module.exports = { productRouter };