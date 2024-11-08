const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
const auth = require("./routes/auth");
const admin = require("./routes/admin");
const contacts = require("./routes/Contact");
const cookieParser = require("cookie-parser");
const slideshowRoutes = require("./routes/slideshowRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/order");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

connectDb();

app.use(
  cors({
    origin: [`${process.env.WEBSITE_URL}`, `${process.env.originAdmin}`],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", auth);
app.use("/api/admin", admin);
app.use("/api", contacts);
app.use("/api/slideshow", slideshowRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
