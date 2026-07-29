const mongoose = require('mongoose');
var validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "Invalid email"
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: validator.isStrongPassword,
            message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol"
        }
    },
    about: {
        type: String,
        required: false,
        default: "Hey i am using CodePartner",
    },
    photoURL: {
        type: String,
        required: false,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        validate: {
            validator: validator.isURL,
            message: "Invalid URL"
        }
    },
    skills: [{
        type: String,
        required: false,
    }],
    leetcodeLink: {
        type: String,
        required: false,
        default: "",
        validate: {
            validator: function(v) {
                if (!v) return true;
                return validator.isURL(v) && (v.includes('leetcode.com') || v.includes('leetcode.com/u/'));
            },
            message: "Invalid LeetCode URL"
        }
    },
    githubLink: {
        type: String,
        required: false,
        default: "",
        validate: {
            validator: function(v) {
                if (!v) return true;
                return validator.isURL(v) && v.includes('github.com');
            },
            message: "Invalid GitHub URL"
        }
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;