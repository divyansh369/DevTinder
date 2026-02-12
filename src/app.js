const express = require("express");
const User = require("./models/user"); // Import the User model
const { connectDB } = require("./config/database"); // Import the database connection
const { validateSignUpData } = require("./Utils/validation"); // Import the validation function for sign-up data
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing

const app = express();

/**   Middleware to parse JSON request bodies ie.
 *  if we do POST request to /signup with JSON data in the body, this middleware will parse
 *  that data and make it available in req.body. Without this middleware,
 *  req.body would be undefined when we try to access it in the route handler.
 * So, it's essential to include this middleware if we want to handle JSON data in our Express application.
 */
app.use(express.json());

app.post("/signup", async (req, res) => {
  // create a new instance of the User model using the data from the request body from the api request.
  try {
    // 1. validate the sign-up data using the validation function
    validateSignUpData(req);
    
    // 2. Encrypt the password before saving to the database (optional but recommended for security)
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash, 
    });
 
    // save the user to the database
    await user
      .save()
      .then(() => {
        res.status(201).json({ message: "User created successfully" });
      })
      .catch((err) => {
        console.error("Error creating user:", err);
        res.status(500).json({ message: err.message });
      });
  } catch (err) {
    console.error("Validation error:", err);
    res.status(400).json({ message: "Validation error: " + err.message });
  }
});

app.post("/login", async (req, res) => {
  const {emailId, password} = req.body;

  try{
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).json({ message: "User not found 😔 Please try again " });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password !!! Please try again ❌" });
    }
    res.json({ message: "Login successful ✅"});
  }
  catch(err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Error during login" });
  }
});

// find user by email and password
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user || user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    } else {
      res.json(user);
    }
  } catch (err) {
    console.error("Error finding user:", err);
    res.status(500).json({ message: "Error finding user" });
  }
});

// Feed API - get /feed - get all the user from database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// delete the user by email
app.delete("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const deletedUser = await User.findOneAndDelete({ emailId: userEmail });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Error deleting user" });
  }
});

// update the user by emailid
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const updateData = req.body;

  try {
    const ALLOWED_UPDATES = [
      "photoUrl",
      "password",
      "gender",
      "about",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(updateData).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );

    if (!isUpdateAllowed) {
      res.status(400).json({
        message:
          "Invalid updates! Only photoUrl, password, gender, about and skills can be updated.",
      });
    }

    if (updateData?.skills.length > 10) {
      throw new Error("You can add up to 10 skills only");
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      updateData,
      { returnDocument: "after", runValidators: true },
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "UPDATE FAILED: " + err.message });
  }
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
