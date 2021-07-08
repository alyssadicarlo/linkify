'use strict';

//imports
const express = require("express");
const LinkModel = require("../models/Links");
const {nanoid} = require("nanoid");
const ClicksModel = require("../models/Clicks");

//create a router 
const router = express.Router();


//GET dashboard
router.get("/dashboard/:search?:sort?", async (req,res)=>{

    //render dashboard page
    //Get the sort type selected, if none selected default to date_added
    let sort = req.query.sort;
    if(!sort)
    {
        sort = "date_added";
    }

    //Get total clicks for current user from the Clicks model
    const userClicksResponse = await ClicksModel.getTotalUserClicks(req.session.user_id);
    const totalUserClicks = userClicksResponse.length;

    //Get total clicks for each link from the Clicks model

    //if there is a search parameter
    if(!!req.query.search)
    {
        //Return the links matching the search parameter & sort type
        const linkData = await LinkModel.searchLinks(req.query.search, req.session.user_id, sort);
        
        //render the template with the provided link data
        res.render("template", {
            locals: {
                title: "Dashboard",
                is_logged_in: req.session.is_logged_in,
                user_first_name: req.session.first_name,
                link_data: linkData,
                click_count: totalUserClicks
            },
            partials: {
                body: "partials/dashboard"
            }
        })
    }
    else
    {
        //Get the link data by current userID, sorted by sort type
        const user_id = await req.session.user_id
        const linkData = await LinkModel.getBy(user_id, sort);
        
        //render the template with the provided data
        res.render("template", {
            locals: {
                title: "Dashboard",
                is_logged_in: req.session.is_logged_in,
                user_first_name: req.session.first_name,
                link_data: linkData,
                click_count: totalUserClicks
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

    //validate link
    let url = "http://" + target_url;
    let isURLValid = isValidURL(url);

    if(isURLValid)
    {
        //Run addLink function of link model
        const response = await LinkModel.addLink(userID, uuid, url);
            
        if(response.rowCount === 1)
        {
            console.log("added a row!");
            console.log("Here is your link: " + "www.linkify.com/" + uuid);
            const shortened_link = "127.0.0.1:3000/" + uuid;
            res.render("template", {
                locals: {
                    title: "Home",
                    is_logged_in: req.session.is_logged_in,
                    user_first_name: req.session.first_name,
                    shortened_link: shortened_link,
                    target_url: url
                },
                partials: {
                    body: "partials/home-success"
                }
            })
        }
    }
    else
    {
        console.log("This URL is not valid");
    }

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

    //validate link
    let url = "http://" + target_url;
    let isURLValid = isValidURL(url);
    if(isURLValid)
    {
        //Escape any ' that appear in the title
        const titleString = title[0] + title.slice(1).replace(/'/g, "''");
        //Run addLink function of link model
        const response = await LinkModel.addCustomLink(userID, uuid, custom_link, url, titleString);
        res.redirect('/links/dashboard');
    }
    else
    {
        console.log("This is not a valid URL!");
    }
})

//POST update
router.post("/update", async (req,res)=>{
    //get id, custom link value, targetURL, and title
    const { id, custom_url, title} = req.body;
    //Escape any ' that appear in the title
    const titleString = title[0] + title.slice(1).replace(/'/g, "''");
    //Run updateLink function of link model
    const response = await LinkModel.updateLink(id, custom_url, titleString);
    res.redirect('/links/dashboard');
})

//POST delete
router.post("/delete", async (req,res)=>{
    //Get link ID to delete
    const { id } = req.body;
    //Run deleteLink function of link model
    const response = await LinkModel.deleteLink(id)
    res.redirect('/links/dashboard');
})

function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
  };

//export the router for use in the app
module.exports = router;