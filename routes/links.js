'use strict';

//imports
const express = require("express");
const UserModel = require("../models/Users");

//create a router 
const router = express.Router();

//GET dashboard
router.get("/dashboard", async (req,res)=>{
    //render dashboard page
    //pass links data
})

//POST add
router.post("links/add", async (req,res)=>{
    //get link URL
    //get user ID (if no user id from session, uID = 0)
    //create UUID for link

    //Create new link
    //Run addLink function of link model
})

//POST update
router.post("/links/update", async (req,res)=>{
    //get custom link value
    //get targetURL
    //get title value
    
    //Create new link
    //Run updateLink function of link model
})

//POST delete
router.post("/links/delete", async (req,res)=>{
    //Get link ID to delete
    
    //Create new link
    //Run deleteLink function of link model
})




//export the router for use in the app
module.exports = router;