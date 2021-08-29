const mongoose = require("mongoose");
// const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmpassword: {
        type: String,
        required: true,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});

loginSchema.methods.generateAuthToken = async function (res) {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, "mynameisansumanmishraandiamamernstackdevloper");
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        res.send(`merror is ${error}`);
    }
};

// hashing is done before saveing the password to the data base
// loginSchema.pre("save", async function (next) {
//    if (this.isModified("password")) {
//       this.password = await bcryptjs.hash(this.password, 10); // hash take two parameter one is password field and other one is how much time hashing required

//       this.confirmpassword = undefined;
//    }
//    next();
// });

// now we need to create a collection

const Login = new mongoose.model("login", loginSchema);

module.exports = Login;
