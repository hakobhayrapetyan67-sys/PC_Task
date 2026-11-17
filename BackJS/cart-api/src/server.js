const express = require("express");

const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");

const {
  notFound,
  errorHandler
} = require("./middleware/error.middleware");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Shopping cart API is running"
  });
});

app.use("/products", productRoutes);
app.use("/carts", cartRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
