# Local Library - A Mozilla Example App

## What it does:

This is the app that is built with the Mozilla Express Tutorial found here: [Build it yourself!](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs)  This was one of the first Node/Express Tutorial I followed, and it is beautifully put together. The final app is a system for a fictitious library to store all their info about their books, authors, and genres. It is all rendered server-side with an express view engine (pug).

## What it uses:

**Dependencies List**
* async
* body-parser
* cookie-parser
* debug
* express
* express-validator
* moment
* mongoose
* morgan
* npm
* pug
* serve-favicon
* nodemon

>This app uses *MongoDB* as the database. 

>This app uses *pug* as the view engine to render web pages. 

>This app uses *express-validator* to validate data from forms to add to the database. 

>This app uses *mongoose* to access MongoDB and work with author & book info.


## How to run it:

* Start by cloning or downloading the entire *Node_Projects* repo from GitHub
* Make sure you have node.js installed:
    * Open Terminal on Mac or Command Prompt on Windows.
    * Type `node --version` and press **Enter**
    * If you see a version like `v9.10.0`, you are good to go.
    * If your version is lower, type `npm i npm` and press **Enter**.
    * If you see an error and not a version, go download and install node.js here: [Latest Node.js Download](https://nodejs.org/en/download/)
* Make sure you have MongoDB installed and setup.
    * Open Terminal on Mac or Command Prompt on Windows.
    * Type `mongo --version` and press **Enter**.
    * If the first line you see looks like `MongoDB shell version v3.6.3`, you are good to go.
    * If the version is lower, check out this article: [How to Upgrade MongoDB](https://docs.mongodb.com/manual/tutorial/upgrade-revision/)
    * If you see an error and not a version, go download, install, and setup MongoDB with the instructions in this article: [How to Get MongoDB](https://docs.mongodb.com/manual/installation/)
* Open Terminal on Mac or Command Prompt on Windows.
* Type `mongod` to and press **Enter** to run a MongoDB instance.
    * Make sure the database is running on port 27017.
* Open a new Terminal or Command Prompt window, and navigate to the *01 - Local Library* directory.
* Type `npm run devstart` and press **Enter** to run the server.
* Go to http://localhost:3000 in a web browser to see and use the project.

## Summary

This was a great first Express.js app, and I learned a lot. Mozilla once again put together a great tutorial for really learning and understanding the technology. This was a simple database-driven web app, rendered server side. Check out my other apps to see how I moved on from here.
