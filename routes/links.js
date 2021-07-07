'use strict';

//imports
const express = require("express");
const UserModel = require("../models/Users");
const LinkModel = require("../models/Links");
const {nanoid} = require("nanoid");

//create a router 
const router = express.Router();


//GET dashboard
router.get("/dashboard/:search?:sort?", async (req,res)=>{

    //render dashboard page
    console.log(req.query.search);
    console.log(req.query.sort);

    //console.log(linkData);
    if(!!req.query.search)
    {
        //console.log(req.query.search);
        
        //pass links data (date added by default)
        const linkData = await LinkModel.searchLinks(req.query.search, req.session.user_id, req.query.sort);
        console.log(linkData);
        res.render("template", {
            locals: {
                title: "Dashboard",
                is_logged_in: req.session.is_logged_in,
                user_first_name: req.session.first_name,
                link_data: linkData
            },
            partials: {
                body: "partials/dashboard"
            }
        })
    }
    else
    {
        //pass links data (date added by default)
        console.log("no search or sort");
        const user_id = await req.session.user_id
        const linkData = await LinkModel.getAll(user_id);
        res.render("template", {
            locals: {
                title: "Dashboard",
                is_logged_in: req.session.is_logged_in,
                user_first_name: req.session.first_name,
                link_data: linkData
            },
            partials: {
                body: "partials/dashboard"
            }
        })
    }

})

//POST add
router.post("/add", async (req,res)=>{
    //get link URL from input form
    const {target_url} = req.body;
    //get user ID (if no user id from session, uID = 0)
    let userID = null;
    console.log(req.session.user_id);
    if(req.session.is_logged_in === true)
    {
        userID = req.session.user_id;
    }
    else
    {
        userID = 1;
    }
    
    //create UUID for link
    const uuid = nanoid(7);

    //Run addLink function of link model
    const response = await LinkModel.addLink(userID, uuid, target_url);
    
})

//POST custom_add
router.post("/custom_add", async (req,res)=>{
    //get link URL from input form
    const { custom_link, target_url, title } = req.body;
    //get user ID (if no user id from session, uID = 0)
    let userID = null;
    if(req.session.is_logged_in === true)
    {
        userID = req.session.user_id;
    }
    else
    {
        userID = 1;
    }
    
    //create UUID for link
    const uuid = nanoid(7);

    //Escape any ' that appear in the title
    const titleString = title[0] + title.slice(1).replace(/'/g, "''");
    //Run addLink function of link model
    const response = await LinkModel.addCustomLink(userID, uuid, custom_link, target_url, titleString);
    res.redirect('/');
})

//POST update
router.post("/update", async (req,res)=>{
    //get id, custom link value, targetURL, and title
    const { id, custom_url, target_url, title} = req.body;
    //Escape any ' that appear in the title
    const titleString = title[0] + title.slice(1).replace(/'/g, "''");
    //Run updateLink function of link model
    const response = await LinkModel.updateLink(id, custom_url, target_url, titleString);
    res.redirect('/links/dashboard');
})

//POST delete
router.post("/delete", async (req,res)=>{
    //Get link ID to delete
    const { id } = req.body;
    //Run deleteLink function of link model
    const response = await LinkModel.deleteLink(id)
    res.redirect('/links/dashboard')
})



//export the router for use in the app
module.exports = router;