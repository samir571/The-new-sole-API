require('colors');
const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require('express-fileupload')
const morgan = require("morgan")


// Import Router
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const categoryRouter = require("./routes/categories");
const productRouter = require("./routes/products");
const orderRouter = require("./routes/orderRoutes");
const cartRouter = require("./routes/cartRoutes") 
const customizeRouter = require("./routes/customize");

mongoose.set('strictQuery', false);

// Database Connection
mongoose
  .connect(process.env.DB_URI)
  .then(() =>
    console.log(

    "=========================================MONGODB DATABASE CONNECTED SUCESSFULLY=============================================="
    )
  )
  .catch((err) => console.log("Database Not Connected !!!" ));

// Middleware
app.use(cors());
app.use(express.static("public"));
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload({useTempFiles:true}))
// Routes
app.use((req, res, next) => {
  console.log(req.path);
  next();
})
app.use("/api", authRouter);
app.use("/api/user", usersRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/cart", cartRouter)
app.use("/api/customize", customizeRouter);


// Run Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on ", PORT);
});
