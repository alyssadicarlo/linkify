# Linkify
A full stack web application to shorten urls inspired by bitly.com 

Active development: July 6-12, 2021

## Overview
Users can generate random-character urls from the homepage or login to create, update, and delete their own custom shortened urls.

## What We Used

Built with Node.js
### Languages:
- HTML
- CSS
- Javascript

### Frameworks
- [Halfmoon](http://gethalfmoon.com)

### Node Module Dependencies:
- express
- express-es6-template-engine
- express-session
- bcrypt
- dotenv
- moment
- nanoid
- pg-promise
 
<!-- ## Screenshots
![TITLE](url) -->

## Features
* Users can quickly create short urls without logging in and copy to clipboard
* Logged-in users have access to their dashboard, where they can:
    * View stats
        * Total clicks for all links in each of the last seven days
        * Total characters shortened
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
        * Choose a custom avatar
        * Delete their account from the database
* Users can choose to view dark or light modes

## Future Improvements
- Add password recovery for users having trouble logging in
- Allow users to choose avatars on signup
## Group

<a href="https://github.com/logancooper">Logan Cooper</a>
    - Primarily responsible for database setup and routes.

<a href="https://github.com/alyssadicarlo">Alyssa DiCarlo</a>
    - Primarily responsible for front-end/views.

<a href="https://github.com/natelee3">Nate Lee</a>
    - Primarily responsible for data models, user-profile view, and darkmode implementation.