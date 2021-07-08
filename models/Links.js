'use strict';

const db = require('./conn');


class LinksModel {
    constructor(id, userID, uuid, custom_link, target_url, title, date_added, click_count) {
        this.id = id;
        this.userID = userID;
        this.uuid = uuid;
        this.custom_link = custom_link;
        this.target_url = target_url;
        this.title = title;
        this.date_added = date_added;
        this.click_count = click_count;
    }

    //Method to retrieve all links for a specific user
    static async getAll(userID) {
        try {
            const response = await db.any(
                `SELECT * FROM links
                WHERE userID = ${userID}
                ORDER by id;`
            )
            return response;
        } catch(error) {
            console.error("ERROR: ", error);
            return error;
        }
    }

    //Method to retrieve all links for user and sort by user parameter
    static async getBy(userID, parameter) {
        try {
            let query = "";
            if(parameter === "title")
            {
                query = `SELECT * FROM links
                WHERE userID = ${userID}
                ORDER by ${parameter};`
            }
            else
            {
                query = `SELECT * FROM links
                WHERE userID = ${userID}
                ORDER by ${parameter} DESC;`
            }
            const response = await db.any(query);
            return response;
        } catch(error) {
            console.error("ERROR: ", error);
            return error;
        }
    }

    //Method to create custom link while logged in
    static async addCustomLink(userID, uuid, custom_link, target_url, title) {
        try {
            const query = `
                INSERT INTO links 
                    (userID, uuid, custom_link, target_url, title)
                VALUES
                (${userID}, '${uuid}', '${custom_link}', '${target_url}', '${title}');`
            const response = await db.result(query);
            return response;
        } catch(error) {
            console.error("ERROR: ", error);
            return error;
        }
    }

    //Method to add link without being logged in
    static async addLink(userID, uuid, target_url) {
        try {
            const query = `
                INSERT INTO links 
                    (userID, uuid, target_url)
                VALUES
                ('${userID}','${uuid}', '${target_url}');`
            const response = await db.result(query);
            return response;
        } catch(error) {
            console.error("ERROR: ", error);
            return error;
        }
    }

    //Method to update existing custom link
    static async updateLink(id, custom_link, title) {
        try {
            const query = `
                UPDATE links
                SET custom_link = '${custom_link}',
                title = '${title}'
                WHERE id = ${id};`
            const response = await db.result(query);
            return response;
        } catch(error) {
            console.error("ERROR: ", error);
            return error;
        }
    }

    //Method to find user for a uuid
    static async findUser(uuid) {
        try {
            const response = await db.one(`
                SELECT userID FROM links
                WHERE uuid = '${uuid}';`
            )
        return response;

        } catch(error) {
            console.error("ERROR: ", error);
            return error;
        }
    }

    //Method to delete a saved link
    static async deleteLink(id) {
        try {
            const response = await db.result(
                `DELETE FROM links
                WHERE id = ${id};`
            )
            return response;
        } catch(error) {
            console.log("ERROR: ", error);
        }
    }

    static async searchLinks(search, user_id, sort) {
        if (!!sort) {
            try {
                let query = "";
                if(sort === "title"){
                    query = `
                    SELECT * FROM links
                    WHERE userID = ${user_id}
                    AND target_url LIKE '%${search}%'
                    ORDER by ${sort};
                    `;
                }
                else{
                    query = `
                    SELECT * FROM links
                    WHERE userID = ${user_id}
                    AND target_url LIKE '%${search}%'
                    ORDER by ${sort} DESC;
                    `;
                }

                const response = await db.any(query);
                return response;
            } catch(error) {
                console.log("ERROR: ", error);
            }
        } else {
            try {
                const query = `
                    SELECT * FROM links
                    WHERE userID = ${user_id}
                    AND target_url LIKE '%${parameter}%'
                    ORDER by date_added;
                    `
                const response = await db.any(query);
                return response;
            } catch(error) {
                console.log("ERROR: ", error);
            }
        }
    }

    static async getTargetUrl(uuid) {
        try {
            const query = `
                SELECT target_url FROM links
                WHERE uuid = '${uuid}' 
                OR custom_link = '${uuid}';

                `

            const response = await db.one(query);
            return response;
        } catch(error) {
            console.log("ERROR: ", error);
        }
    }


    static async deleteUserLinks(user_id) {
        try {
            const response = await db.result(
                `DELETE FROM links
                WHERE userID = ${user_id};`
            )
        } catch(error) {
            console.log("ERROR: ", error);
        }
    }

    //return linkID of the provided UUID
    static async getLinkID(uuid) {
        try {
            const query = `
                SELECT id FROM links
                WHERE uuid = '${uuid}' 
                OR custom_link = '${uuid}';
                `

            const response = await db.one(query);
            return response;
        } catch(error) {
            console.log("ERROR: ", error);
        }
    }
}

module.exports = LinksModel;