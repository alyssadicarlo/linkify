'use strict';
//import express & create router
const express = require('express');
const router = express.Router();

//route for home page
router.get('/', (req, res) => {
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
})

//export the router for use in the app
module.exports = router
