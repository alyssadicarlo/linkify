'use strict';

//imports
const express = require("express");
const moment = require('moment');
const LinkModel = require("../models/Links");
const {nanoid} = require("nanoid");
const ClicksModel = require("../models/Clicks");

//create a router 
const router = express.Router();

function last7Days() {
    let daysAgo = []
    for(var i=7; i>0; i--) {
        daysAgo.push(moment().subtract(i, 'days').format("MM DD"));
    }
    return daysAgo
}


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

    //TOTAL CLICKS PER USER FOR THE LAST 7 DAY
    //FIRST ELEMENT IS TOTAL CLICKS FROM 7 DAYS AGO
    //LAST ELEMENT IS TOTACL CLICKS FROM TODAY

    //create clicksPerDay array - int array of size 7
    let clicksPerDay = [0,0,0,0,0,0,0];

    //for each day in the past 7 days (ending with today), total up the number of clicks that have a date matching that day
    let lastSevenDays = [];
    for(let i = 6; i > -1; i--)
    {
        const day_date = new Date();
        day_date.setDate(day_date.getDate() - i);
        
        lastSevenDays.push(day_date);
    }
    lastSevenDays.join(',');

    userClicksResponse.forEach(click => {
        const click_date = new Date(click.date_added);

        for(let i = 0; i < 7; i++)
        {
            let weekday = new Date(lastSevenDays[i]);
            if(onSameDay(click_date, weekday))
            {
                clicksPerDay[i] += 1;
            }
        }

    });
    
    //assign that to the array
    let linkQueryData = null;

    //if there is a search parameter
    if(!!req.query.search)
    {
        //Return the links matching the search parameter & sort type
        
        if(sort !== "click_count")
        {
            linkQueryData = await LinkModel.searchLinks(req.query.search, req.session.user_id, sort);
        }
        else
        {
            linkQueryData = await LinkModel.searchLinks(req.query.search, req.session.user_id, "date_added");
            //sort the returned data by click count
        }

        //Get total clicks for each link from the Clicks model

        //create LinkModel list linkData
        let linkData = [];
        //iterate through the returned link data 
        for(const link of linkQueryData) 
        {
            
            //Use the linkID to query for click_count
            const linkClicks = await ClicksModel.getTotalLinkClicks(link.id);
            let click_count = 0;
            if(linkClicks.length !== null)
            {
                click_count = linkClicks.length;
            }
            
            //create a LinkModel Instance using the link query data/calculated click count
            const newLinkModel = new LinkModel(link.id,link.userID,link.uuid,link.custom_link,link.target_url,link.title,link.date_added, click_count);

            //add it to the linkData list
            linkData.push(newLinkModel);
        }
        
        //console.log(linkData);

        //render the template with the provided link data
        res.render("template", {
            locals: {
                title: "Dashboard",
                is_logged_in: req.session.is_logged_in,
                user_first_name: req.session.first_name,
                link_data: linkData,
                total_user_click_count: totalUserClicks,
                clicks_per_day: clicksPerDay,
                click_data: clicksPerDay,
                last7Days: last7Days(),
                avatar: req.session.avatar
            },
            partials: {
                body: "partials/dashboard",
                failure: 'partials/blank'
            }
        })
    }
    else
    {
        //Get the link data by current userID, sorted by sort type
        const user_id = await req.session.user_id;
        if(sort !== "click_count")
        {
            linkQueryData = await LinkModel.getBy(user_id, sort);
        }
        else
        {
            linkQueryData = await LinkModel.getBy(user_id, "date_added");
        }
        

        //Get total clicks for each link from the Clicks model

        //create LinkModel list linkData
        let linkData = [];
        //iterate through the returned link data 
        for(const link of linkQueryData) 
        {
            
            //Use the linkID to query for click_count
            const linkClicks = await ClicksModel.getTotalLinkClicks(link.id);
            let click_count = 0;
            if(linkClicks.length !== null)
            {
                click_count = linkClicks.length;
            }
            //console.log(click_count);
            
            //create a LinkModel Instance using the link query data/calculated click count
            const newLinkModel = new LinkModel(link.id,link.userID,link.uuid,link.custom_link,link.target_url,link.title,link.date_added, click_count);

            //add it to the linkData list
            linkData.push(newLinkModel);
        }
        
        //sort the returned data by click count if that is the option
        if(sort === "click_count")
        {
            linkData = linkData.sort((a,b) => (a.click_count < b.click_count) ? 1 : -1);
        }
        


        //render the template with the provided data
        res.render("template", {
            locals: {
                title: "Dashboard",
                is_logged_in: req.session.is_logged_in,
                user_first_name: req.session.first_name,
                link_data: linkData,
                total_user_click_count: totalUserClicks,
                click_data: clicksPerDay,
                last7Days: last7Days(),
                avatar: req.session.avatar
            },
            partials: {
                body: "partials/dashboard",
                failure: 'partials/blank'
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
                    target_url: url,
                    avatar: req.session.avatar
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
    //if first letters of target_url aren't "http"
    let url = "http://" + target_url;
    let isURLValid = isValidURL(url);
    if(isURLValid)
    {
        //Escape any ' that appear in the title
        const titleString = title[0] + title.slice(1).replace(/'/g, "''");
        //Run addLink function of link model
        const response = await LinkModel.addCustomLink(userID, uuid, custom_link, url, titleString);
        if (response.rowCount === 1) {
            res.redirect('/links/dashboard');
        } else {
            const user_id = await req.session.user_id
            const linkData = await LinkModel.getBy(user_id, "date_added");
            const userClicksResponse = await ClicksModel.getTotalUserClicks(req.session.user_id);
            const totalUserClicks = userClicksResponse.length;
            res.render("template", {
                locals: {
                    title: "Dashboard",
                    is_logged_in: req.session.is_logged_in,
                    user_first_name: req.session.first_name,
                    link_data: linkData,
                    click_count: totalUserClicks,
                    click_data: clicksPerDay,
                    last7Days: last7Days(),
                    avatar: req.session.avatar
                },
                partials: {
                    body: "partials/dashboard",
                    failure: 'partials/dashboard-failure'
                }
            });
        }
    }
    else
    {
        console.log("This is not a valid URL!");
        const user_id = await req.session.user_id
        const linkData = await LinkModel.getBy(user_id, "date_added");
        const userClicksResponse = await ClicksModel.getTotalUserClicks(req.session.user_id);
        const totalUserClicks = userClicksResponse.length;
        res.render("template", {
            locals: {
                title: "Dashboard",
                is_logged_in: req.session.is_logged_in,
                user_first_name: req.session.first_name,
                link_data: linkData,
                click_count: totalUserClicks,
                click_data: [0, 10, 5, 2, 20, 30, 45],
                last7Days: last7Days(),
                avatar: req.session.avatar
            },
            partials: {
                body: "partials/dashboard",
                failure: 'partials/dashboard-notvalid'
            }
        });
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

function onSameDay(first,second)
{
    return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
}

//export the router for use in the app
module.exports = router;