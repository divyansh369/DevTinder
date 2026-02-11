const express = require("express");
const User = require("./models/user"); // Import the User model
const { connectDB } = require("./config/database"); // Import the database connection

const app = express();

/**   Middleware to parse JSON request bodies ie.
 *  if we do POST request to /signup with JSON data in the body, this middleware will parse
 *  that data and make it available in req.body. Without this middleware,
 *  req.body would be undefined when we try to access it in the route handler. 
 * So, it's essential to include this middleware if we want to handle JSON data in our Express application.
*/
app.use(express.json()); 

app.get("/user", (req, res) => {
  res.json({ message: "Hello, User!" });
});

app.post("/signup", async (req, res) => {
  // create a new instance of the User model using the userObj
  console.log(req.body);

  // create a new instance of the User model using the data from the request body from the api request. 
  const user = new User(req.body);

  // save the user to the database
  await user
    .save()
    .then(() => {
      res.status(201).json({ message: "User created successfully" });
    })
    .catch((err) => {
      console.error("Error creating user:", err);
      res.status(500).json({ message: "Error creating user" });
    });
});

connectDB()
  .then(() => {
    console.log("Database connected successfully !!!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
