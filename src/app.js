const express = require('express');

const app = express();

// use app.get() and app.post() to handle HTTP methods
app.get("/user/:userId/:name/:password",(req,res) => {
    console.log(req.params)
    res.send({"firstName":"John","lastName":"Doe"});
})

app.post("/user",(req,res) => {
    // saving user to database
    res.send("User saved successfully 👍");
});

app.delete("/user",(req,res) => {
    // deleting user from database
    res.send("User deleted successfully !!!");
});

app.put("/user",(req,res) => {
    // deleting user from database
    res.send("User updated successfully !!!");
});

// use app.use() to handle all HTTP methods for a specific path
app.use("/user", (req, res) => {
  res.send("Hello from /user");
});

// app.use("/", (req, res) => {
//   res.send("Listening on /");
// });


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});