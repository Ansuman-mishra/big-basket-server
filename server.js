const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { Router } = require("express");
const cors = require("cors");
const bcryptjs = require("bcryptjs");
const Login = require("./models/login");
const cookieParser = require("cookie-parser");

//config cors
app.use(cors());

//configuring env

dotenv.config({ path: "./config/config.env" });

//config express to recieve form data

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

var port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send(`<h2>welcome to AnsumanBlog</h2>`);
});

//connect to the mongodb database

mongoose
    .connect(process.env.MONGO_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then((res) => {
        console.log("connected to the mongodb successfully......");
    })
    .catch((err) => {
        console.error(err);
        process.exit(1); //this will stop the nodejs process if unable to connect with mongodb
    });
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            const registerEmp = new Login({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword,
            });
            const token = await registerEmp.generateAuthToken();

            res.cookie("jwt", token);
            //hashing part is done in register.js
            const registered = await registerEmp.save();
            res.status(200).json({
                result: "registered successfully",
                register: registered,
            });
        } else {
            res.send("password are not matching");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error.message,
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const usermail = await Login.findOne({ email: email }); //to verify the email the user has written with database email
        const isMatch = usermail.password === password; // it verify that password enter by user in login form is there in database or not
        const token = await usermail.generateAuthToken();
        res.cookie("jwt", token);
        // console.log(token);
        // console.log(usermail.password);
        // console.log(isMatch);
        if (isMatch) {
            res.status(200).json({
                result: "login successfully",
            });
        } else {
            res.status(500).json({
                msg: "invalid cridential plz write correct password",
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: error.message,
        });
    }
});

// configuring Router

// app.use("/login", require("./routers/loginRouter"));
app.use("/api", require("./routers/apiRouter"));

app.listen(port, "0.0.0.0", () => {
    console.log(`Express server start at http://localhost:${port}`);
});
