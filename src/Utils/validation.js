const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName || !emailId || !password) {
        throw new Error("All fields are required");
    }
    else if (firstName.trim().length === 0 || lastName.trim().length === 0) {
        throw new Error("First name and last name cannot be empty");
    }
    else if(!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        throw new Error("Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol");
    }
}

module.exports = {
    validateSignUpData
}