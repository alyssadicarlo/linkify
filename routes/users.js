'use strict';
//imports
const express = require("express");
const UserModel = require("../models/Users");
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

//GET user profile
router.get("/profile", (req, res) => {
    res.render("template", {
        locals: {
            title: "User Profile",
            is_logged_in: req.session.is_logged_in,
            user_first_name: req.session.first_name,
            sessionData: req.session
        },
        partials: {
            body: "partials/user-profile"
        }
    })
})

router.post("/edit", async (req, res) => {
    //Get user id from req.session
    const user_id = req.session.user_id;
    console.log("This is the user id: ", user_id)
    //Get everything else from req.body
    const { first_name, last_name, email, password, password_confirm } = req.body;
    if (!!first_name) {
        const response = await UserModel.editName(user_id, first_name, last_name);
        req.session.first_name = first_name;
        req.session.last_name = last_name;
    } else if (!!email) {
        const response = await UserModel.editEmail(user_id, email);
        req.session.email = email;
    } else if (!!password) {
        //Check that passwords match
        if(password === password_confirm) {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);

        const response = await UserModel.editPassword(user_id, hash);
        } else {
        console.log("Your password and password confirmation fields do not match!");
        return;
        }
    }
    res.redirect('/users/profile');
})

//POST login
router.post("/login", async (req,res)=>{
    const {email, password} = req.body;

    //CHANGE TO CORRECT CONSTRUCTOR//
    const user = new UserModel(null, null, null, email, password, null);

    const response = await user.login();
    console.log("USER LOGIN RESPONSE: ", response);

    if(response.isValid)
    {
        const {isValid, user_id, first_name, last_name, email} = response;
        req.session.is_logged_in = isValid;
        req.session.user_id = user_id;
        req.session.first_name = first_name;
        req.session.last_name = last_name;
        req.session.email = email;
        res.redirect("/links/dashboard");
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

//export the router for use in the app
module.exports = router;