'use strict';

const db = require('./conn');
const bcrypt = require('bcryptjs');

class UsersModel {
    constructor(id, first_name, last_name, email, password, avatar) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.avatar = avatar;
    }

    checkPassword(hashedPassword) {
        return bcrypt.compareSync(this.password, hashedPassword)
    }

    static async addUser(first_name, last_name, email, password) {
        try {
            const query = `
            INSERT INTO users
                (first_name, last_name, email, password)
            VALUES
                ('${first_name}','${last_name}','${email}','${password}') RETURNING id;`;
            const response = await db.one(query);
            return response;
        } catch (error) {
            console.error('ERROR: ', error);
            return error;
        }
    }

    async login() {
        try {
            const query = `SELECT * FROM users
            WHERE email = '${this.email}';`
            const response = await db.one(query);
            const isValid = this.checkPassword(response.password)
            if (!!isValid) {
                const {id, first_name, last_name, email, avatar} = response;
                return { isValid, user_id: id, first_name, last_name, email, avatar}
            } else {
                return {isValid}
            }
        } catch (error) {
            console.error('ERROR: ', error);
            return error;
        }
    }

    static async editName(user_id, first_name, last_name) {
        try {
            const response = await db.result(`
                UPDATE users
                SET first_name = '${first_name}',
                    last_name = '${last_name}'
                WHERE id = ${user_id};`
            )
        return response;

        } catch(error) {
            console.error("ERROR: ", error);
            return error;
        }
    }

    static async editEmail(user_id, email) {
        try {
            const response = await db.result(`
                UPDATE users
                SET email = '${email}'
                WHERE id = ${user_id};`
            )
        return response;

        } catch(error) {
            console.error("ERROR: ", error);
            return error;
        }
    }

    static async editPassword(user_id, hash) {
        try {
            const response = await db.result(`
                UPDATE users
                SET password = '${hash}'
                WHERE id = ${user_id};`
            )
        return response;

        } catch(error) {
            console.error("ERROR: ", error);
            return error;
        }
    }

    static async editAvatar(user_id, avatar) {
        try {
            const response = await db.result(`
                UPDATE users
                SET avatar = ${avatar}
                WHERE id = ${user_id};`
            )
        return response;

        } catch(error) {
            console.error("ERROR: ", error);
            return error;
        }
    }

    static async deleteUser(user_id) {
        try {
            const response = await db.result(`
                DELETE FROM users
                WHERE id = ${user_id};`
            )
        return response;

        } catch(error) {
            console.error("ERROR: ", error);
            return error;
        }
    }

    static async addToCharShortened(user_id, amount_to_add)
    {
        //add the amount_to_add to the characters_shortened column of the user table at the provided ID
        try {
            const response = await db.result(`
                UPDATE users
                    SET characters_shortened = characters_shortened + '${amount_to_add}'
                    WHERE id = ${user_id};`
            )
        return response;

        } catch(error) {
            console.error("ERROR: ", error);
            return error;
        }
    }

    static async getTotalCharactersShortened(user_id)
    {
        //return the characters_shortened column for the provided user ID
        try {
            const response = await db.result(`
                SELECT characters_shortened
                FROM users
                WHERE id = ${user_id};`
            )
        return response;
        
        } catch(error) {
            console.error("ERROR: ", error);
            return error;
        }
    }
}

module.exports = UsersModel;