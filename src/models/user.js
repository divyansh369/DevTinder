const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    validate(value){
        if(value.trim().includes(" ") || value.trim().length === 0 || !/^[a-zA-Z]+$/.test(value)){
            throw new Error("First name is not valid");
        }
    }
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "other"].includes(value.toLowerCase())) {
        throw new Error("Gender is not valid");
      }
    },
  },
  photoUrl: {
    type: String,
    default: "https://www.freepik.com/free-photos-vectors/profile",
  },
  about: {
    type: String,
    default: "This user has not added any description yet.",
  },
  skills: {
    type: [String],
  },
},
{
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);