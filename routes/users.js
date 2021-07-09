'use strict';
//imports
const express = require("express");
const UserModel = require("../models/Users");
const bcrypt = require("bcryptjs");
const LinksModel = require("../models/Links");
const ClicksModel = require("../models/Clicks");

//create a router
const router = express.Router();

//GET login
router.get("/login", (req, res)=>{
    res.render("template", {
        locals: {
            title: "Log In",
            is_logged_in: req.session.is_logged_in,
            user_first_name: req.session.first_name,
            avatar: req.session.avatar
        },
        partials: {
            body: "partials/login",
            failure: 'partials/blank'
        }
    })
})

//GET signup
router.get("/signup", (req, res)=>{
    res.render("template", {
        locals: {
            title: "Sign Up",
            is_logged_in: req.session.is_logged_in,
            user_first_name: req.session.first_name,
            avatar: req.session.avatar
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
            sessionData: req.session,
            avatar: req.session.avatar
        },
        partials: {
            body: "partials/user-profile"
        }
    })
})

//POST edit user details
router.post("/edit", async (req, res) => {
    //Get user id from req.session
    const user_id = req.session.user_id;
    console.log("This is the user id: ", user_id)
    //Get everything else from req.body
    const { first_name, last_name, email, password, password_confirm } = req.body;
    if (!!first_name) {
        //Escape any apostrophes in first or last names
        const firstString = first_name[0] + first_name.slice(1).replace(/'/g, "''");
        const lastString = last_name[0] + last_name.slice(1).replace(/'/g, "''");

        const response = await UserModel.editName(user_id, firstString.trim(), lastString.trim());
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

//POST edit user avatar
router.post("/editAvatar", async (req, res) => {
    req.session.avatar = req.body.avatar
    const response = await UserModel.editAvatar(req.session.user_id, req.body.avatar)
    res.redirect('/users/profile')
})

//POST delete user
router.post("/delete", async (req, res) => {
    const user_id = req.session.user_id;
    //Get all links for the user
    const userLinks = await LinksModel.getBy(user_id, "date_added");
    console.log(userLinks[0].id);
    //foreach link in the returned links, delete all clicks related to that link
    for(let i = 0; i < userLinks.length; i++)
    {
        const deleteClicks = await ClicksModel.deleteLinkClicks(userLinks[i].id);
    }
    //delete all of the links
    const deleteLinks = await LinksModel.deleteUserLinks(user_id);
    //delete the user
    const deleteUser = await UserModel.deleteUser(user_id);
    req.session.destroy();
    res.redirect('/');
})

//POST login
router.post("/login", async (req,res)=>{
    const {email, password} = req.body;

    //CHANGE TO CORRECT CONSTRUCTOR//
    const user = new UserModel(null, null, null, email, password, null, null);

    const response = await user.login();
    console.log("USER LOGIN RESPONSE: ", response);

    if(response.isValid)
    {
        const {isValid, user_id, first_name, last_name, email, avatar} = response;
        req.session.is_logged_in = isValid;
        req.session.user_id = user_id;
        req.session.first_name = first_name;
        req.session.last_name = last_name;
        req.session.email = email;
        req.session.avatar = avatar;
        res.redirect("/links/dashboard");
    }
    else
    {
        res.render('template', {
            locals: {
                title: "Log In",
                is_logged_in: req.session.is_logged_in,
                user_first_name: req.session.first_name,
                avatar: req.session.avatar
            },
            partials: {
                body: 'partials/login',
                failure: 'partials/login-failure'
            }
        });
    }
})

//POST signup
router.post("/signup", async (req,res)=>{
    const {first_name, last_name, email, password, password_confirm} = req.body;

    if(password === password_confirm)
    {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);

        //Escape any apostrophes in first or last names
        const firstString = first_name[0] + first_name.slice(1).replace(/'/g, "''");
        const lastString = last_name[0] + last_name.slice(1).replace(/'/g, "''");

        const response = await UserModel.addUser(firstString.trim(), lastString.trim(), email, hash);
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