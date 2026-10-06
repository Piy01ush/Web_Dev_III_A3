// Step -1 import module
const mongoose = require("mongoose");
require("dotenv").config();

// Step -2 Connection building
const connection = mongoose.connect(process.env.MONGO_URI);

// Step -3 Export connection
module.exports = { connection };