const express = require("express");

const app = express();

// use app.use() to handle all HTTP methods for a specific path
app.use(
  "/user",
  (req, res, next) => {
    console.log("Response 1 !!!")
    next();
    res.send("Response 1 !!!");
    console.log("Response 1 !!!");
  },
  (req, res,next) => {
    console.log("Response 2 !!!");
    next();
    console.log("Response 2 !!!");
  },
  (req, res,next) => {
    console.log("Response 3 !!!");
    next();
    console.log("Response 3 !!!");
  },
  (req, res,next) => {
    console.log("Response 4 !!!");
    // res.send("Response 4 !!!");
    next();
  },
);

// app.use("/", (req, res) => {
//   res.send("Listening on /");
// });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
