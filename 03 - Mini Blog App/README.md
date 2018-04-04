# Mini Blog - Client-Side Rendering Single Page Application and HTTP Methods

## What it does:
This app allows the user to post, edit, and delete little mini blog posts and view it all on the main page. It trys to have an intuitive and friendly user interface, and focus on more than just basic implementation. Looks are important, and I strive to always make even my most basic projects have a friendly user interface.

## What it uses:

**Dependencies List**
* body-parser
* cookie-parser
* cors
* debug
* express
* mongoose
* morgan
* nodemon
* serve-favicon

> This app uses a RESTful api to serve JSON data on requests.

> This app uses *MongoDB* as the database. 

> This app uses client-side rendering (JavaScript) to render web pages. 

> This app uses *mongoose* to access MongoDB and work with author & book info.

> This app uses event listeners on buttons to initiate fetches to the api.

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
* Open a new Terminal or Command Prompt window, and navigate to the *03 - Mini Blog App* directory.
* Type `npm run devstart` and press **Enter** to run the server.
* Go to http://localhost:3000 in a web browser to see and use the project.

## Summary

In this project, I taught myself how to use client-side rendering to reduce the server load on the node.js server. I had to learn all about the different HTTP requests availible to optimize the code even further. Check out future projects to see what I learn next!