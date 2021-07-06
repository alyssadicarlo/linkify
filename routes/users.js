//imports
const express = require("express");
const UserModel = require("../models/USERS");
const bcrypt = require("bcryptjs");

//create a router
const router = express.Router();

//GET login
router.get("/login", (req, res)=>{
    res.render("template", {
        locals: {
            title: "Log In",
            is_logged_in: req.session.is_logged_in,
            user_first_name: req.session.first_name
        },
        partials: {
            body: "partials/login"
        }
    })
})

//GET signup
router.get("/signup", (req, res)=>{
    res.render("template", {
        locals: {
            title: "Sign Up",
            is_logged_in: req.session.is_logged_in,
            user_first_name: req.session.first_name
        },
        partials: {
            body: "partials/signup"
        }
    })
})

//GET logout
router.get("/logout", (req,res) => {
    req.session.destroy();
    res.redirect("/");
})

//POST login
router.post("/login", async (req,res)=>{
    const {email, password} = req.body;

    //CHANGE TO CORRECT CONSTRUCTOR//
    const user = new UserModel(null, null, null, email, password);

    const response = await user.login();
    console.log("USER LOGIN RESPONSE: ", response);

    if(response.isValid)
    {
        const {isValid, user_id, first_name, last_name} = response;
        req.session.is_logged_in = isValid;
        req.session.user_id = user_id;
        req.session.first_name = first_name;
        req.session.last_name = last_name;
        res.redirect("/");
    }
    else
    {
        res.sendStatus(403);
    }
    
})

//POST signup
router.post("/signup", async (req,res)=>{
    const {first_name, last_name, email, password, password_confirm} = req.body;

    if(password === password_confirm)
    {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);

        const response = await UserModel.addUser(first_name, last_name, email, hash);
        console.log("POST ROUTE RESPONSE: ", response);
        if(!!response.id)
        {
            res.redirect("/users/login");
        }
        else
        {
            res.status(500).send("ERROR: please try submitting the form again.");
        }
        
    }
    else
    {
        console.log("Your password and password confirmation fields do not match!");
        return;
    }
})

module.exports = router;