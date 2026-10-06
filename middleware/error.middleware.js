// Centralized Error Handling Middleware

const errorMiddleware = (error, req, res, next) => {
  console.log(error);

  res.status(500).send({
    msg: "Something went wrong",
    error: error.message,
  });
};

module.exports = { errorMiddleware };