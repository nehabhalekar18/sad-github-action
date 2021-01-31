import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import productRouter from "./routers/productRouter.js";
import userRouter from "./routers/userRouter.js";
import orderRouter from "./routers/orderRouter.js";
import uploadRouter from "./routers/uploadRouter.js";
import path from "path";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/bookshop", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use("./api/uploads", uploadRouter);
app.use("/api/users", userRouter);

app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

app.get("/api/config/paypad", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});
// when we goto /upload in url . we serve the file to uploads folder.
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.get("/", (req, res) => {
  res.send("server is ready to work");
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

app.listen(3001, () => {
  console.log("serving at 3000");
});
