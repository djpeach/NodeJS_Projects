# User Login - User Authentication and Access Control

## What it does:
This project implements access control on a basic level. It allows users to login or register if they are not logged in already. It then allows users to logout once logged in.  It has a dummy 'Members' area that can only be viewed by logged in users.

## What it uses:

**Dependencies List**
* bcrypt
* body-parser
* connect-flash
* cookie-parser
* crypto
* debug
* express
* express-messages
* express-session
* express-validator
* mongodb
* mongoose
* morgan
* nodemon
* passport
* passport-http
* passport-local
* pug
* serve-favicon

> This app uses *MongoDB* as the database. 

> This app uses *pug* as the view engine to render web pages. 

> This app uses *express-validator* to validate data from forms to add to the database. 

> This app uses *mongoose* to access MongoDB and work with author & book info.

> This app uses bcrypt to encrypt and decrypt user passwords. 

> This app uses passport to authenticate users and log them in and out.

> This app uses connect-flash to create flash messages.

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
* Open a new Terminal or Command Prompt window, and navigate to the *02 - User Login App* directory.
* Type `npm run devstart` and press **Enter** to run the server.
* Go to http://localhost:3000 in a web browser to see and use the project.

## Summary

During this project I solidified my knowledge of server-side rendering and node.js projects in general. I also learned how to implement user-based access control with sessions and cookies. Go ahead and check out my next projects to see how I began to learn client-side rendering and the benfits offered therein.