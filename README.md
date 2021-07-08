# Linkify
A full stack web application to shorten urls inspired by bitly.com

## Overview
Users can generate random-character urls from the homepage or login to create, update, and delete their own custom shortened urls.

## What We Used
### Languages:
- HTML
- CSS
- Javascript

### Node Module Dependencies:
- express
- express-es6-template-engine
- express-session
- bcrypt
- dotenv
- pg-promise
- nanoid
- moment
 
<!-- ## Screenshots
![TITLE](url) -->

## Features
* Users can quickly create short urls without logging in and copy to clipboard
* Logged-in users have access to their dashboard, where they can:
    * View stats on total clicks for all links and total characters shortened
    * View all their existing links
        * Searchable by target url
        * Sortable by title, date added, and click count
    * Interact with links
        * Create links with custom titles and urls
        * Click links to be redirected to the target url
        * Copy links to the clipboard
        * Edit existing links
        * Delete existing links
    * Manage their user profile
        * Edit name, email, and password
        * Delete their account from the database

## Future Improvements
* Allow users to create custom avatars
* Enable light/dark modes
* Chart when links were created on a graph

## Group

- <a href="https://github.com/logancooper">Logan Cooper</a>

- <a href="https://github.com/alyssadicarlo">Alyssa DiCarlo</a>

- <a href="https://github.com/natelee3">Nate Lee</a>