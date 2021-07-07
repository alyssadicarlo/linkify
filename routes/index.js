'use strict';
//import express & create router
const express = require('express');
const router = express.Router();
const LinkModel = require("../models/Links");

//route for home page and redirect
router.get('/:redirect?', (req, res) => {
    //if there is a redirect
    if(!!req.params.redirect)
    {
        console.log(req.params.redirect);
        //get target URL
        const targetURL = LinkModel.getTargetURL(req.params.redirect);
        res.redirect(targetURL);
    }
    else
    {
        console.log("no redirect");
        res.render('template', {
            locals: {
                title: 'Home Page',
                is_logged_in: req.session.is_logged_in,
                user_first_name: req.session.first_name
            },
            partials: {
                body: 'partials/home'
            }
        })
    }
})


//export the router for use in the app
module.exports = router
