'use strict';
//import express & create router
const express = require('express');
const router = express.Router();
const UserModel = require("../models/Users");
const LinkModel = require("../models/Links");
const ClicksModel = require("../models/Clicks");

//route for home page and redirect
router.get('/:redirect?', async (req, res) => {
    //if there is a redirect
    if(!!req.params.redirect)
    {
        //console.log(req.params.redirect);

        //Get the ID of the link we are interacting with
        const linkID = await LinkModel.getLinkID(req.params.redirect);
        
        //Create new Click in DB with the associated linkID
        const response = await ClicksModel.addClick(linkID.id);

        //Get target URL
        const targetURL = await LinkModel.getTargetUrl(req.params.redirect);

        //redirect to the target URL
        res.redirect(targetURL.target_url);
    }
    else
    {
        console.log("no redirect");
        res.render('template', {
            locals: {
                title: 'Home Page',
                is_logged_in: req.session.is_logged_in,
                user_first_name: req.session.first_name,
                avatar: req.session.avatar
            },
            partials: {
                body: 'partials/home'
            }
        })
    }
})


//export the router for use in the app
module.exports = router
