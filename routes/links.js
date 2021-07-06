'use strict';

//imports
const express = require("express");
const UserModel = require("../models/Users");
const LinkModel = require("../models/Links");
const {nanoid} = require("nanoid");

//create a router 
const router = express.Router();

//GET dashboard
router.get("/dashboard", async (req,res)=>{
    //render dashboard page
    //pass links data
    res.render("template", {
        locals: {
            title: "Dashboard",
            //is_logged_in: req.session.is_logged_in,
            //user_first_name: req.session.first_name
        },
        partials: {
            body: "partials/dashboard"
        }
    })
})

//POST add
router.post("/add", async (req,res)=>{
    //get link URL from input form
    const {url} = req.body;
    //get user ID (if no user id from session, uID = 0)
    if(!!req.session.userID)
    {
        const userID = req.session.userID;
    }
    else
    {
        const userID = 1;
    }
    
    //create UUID for link
    const uuid = nanoid(7);

    //Create new link
    const link = new LinkModel(null, userID, uuid, null, url, null, null, null);
    //Run addLink function of link model
    link.addLink(userID, uuid, url);
    
})

//POST update
router.post("/update", async (req,res)=>{
    //get custom link value
    //get targetURL
    //get title value
    
    //Create new link
    //Run updateLink function of link model
})

//POST delete
router.post("/delete", async (req,res)=>{
    //Get link ID to delete
    const { id } = req.body;
    const response = await LinkModel.deleteLink(id)
    res.redirect('/')
    //Create new link
    //Run deleteLink function of link model
})




//export the router for use in the app
module.exports = router;