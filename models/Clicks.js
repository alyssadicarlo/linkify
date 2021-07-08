'use strict';

const db = require('./conn');

class ClicksModel {
    constructor(linkID) {
        this.linkID = linkID;
    }

    static async addClick(link_id)
    {
        //SQL insert statement to add a click to the DB with the given linkID
        try {
            //prepared statement to sanitize the data
            const query = `
            INSERT INTO clicks
                (linkID)
            VALUES
                ('${link_id}')`;
            const response = await db.one(query);
            return response;
        } catch (error) {
            console.error('ERROR: ', error);
            return error;
        }
    }

    static async getTotalUserClicks(user_id){
        //SQL SELECT statement to get all of the Clicks associated with all of the links that are associated with the provided User ID
        try {
            //prepared statement to sanitize the data
            const query = `SELECT clicks.id, clicks.linkid, links.uuid, links.custom_link, links.target_url, clicks.date_added 
            FROM clicks
            INNER JOIN links ON clicks.linkID=links.id
            INNER JOIN users ON links.userID=users.id
            WHERE users.id=${user_id}`;
            const response = await db.any(query);
            return response;
        } catch (error) {
            console.error('ERROR: ', error);
            return error;
        }
    }

    static async getTotalLinksClicks(link_id){

    }

    
}

module.exports = ClicksModel;