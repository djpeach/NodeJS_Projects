# Purpose

The purpose of this document is to describe my preferred structure when building a Node.js RESTful Api. Additionally I will explain the reasoning behind these preferences. Lastly, specific helpful syntax for various npm modules will be linked to, in order to aid in documentation look-up when spinning up an API.

# Core Packages Used

## Production: 

* [body-parser](https://www.npmjs.com/package/body-parser)
* [config](https://www.npmjs.com/package/config)
* [express](https://www.npmjs.com/package/express)
* [mongoose](https://www.npmjs.com/package/mongoose)
* [joi](https://www.npmjs.com/package/joi)

## Development:

* [easy-log](https://www.npmjs.com/package/easy-log)
* [nodemon](https://www.npmjs.com/package/nodemon)

# Folder Structure & Naming Conventions

The folder structure I use may seem redundant, as well as the naming conventions. The folder structure is specifically designed to separate concerns of any size project, so that as it scales it will remain maintainable. The naming conventions are chosen to clearly specify what file is being edited in the tabs/sidebars of various cross-platform IDE's and editors.

* **`config/`**

    *This folder keeps all configuration files for the `config` npm package, and the file names have to be what they specify*
    
    * **`default.json`**
      *Default configuration values for those not specified elsewhere*
      
    * **`development.json`**
      *Configuration values used when the `NODE_ENV` is set to `development`*
      
    * **`production.json`**
      *Configuration values used when the `NODE_ENV` is set to `production`*
      
    * **`custom-environment-variables.json`**
      *Mappings to environment variables, so things like passwords do not need to be stored on the file system*
      
* **`controllers/`**

    *The files here are what connect parts of your project, such as the routers, validators, models*
    
  * **`object.controller.js`**
    *e.g., `user.controller.js`*

* **`generators/`**

  *These are standalone files that can be run to generate data for the database. They ignore controller files, and manipulate other files as they need to on their own.*
  
  * **`objects.generator.js`**
    *e.g., `users.generator.js`*

* **`models/`**

  *These files define the schema and helper functions that `mongoose` will use when saving documents to your database*
  
  * **`object.model.js`**
    *e.g., `user.model.js`*

* **`routers/`**

  *These files determine what functions will be called on each route. They only perform the logic of routing, and hand off all other logic to the appropriate controllers*
  
  * **`object.router.js`**
    *e.g., `user.router.js`*

* **`validators/`**

  *These files define validation functions that will be run by the controllers on user input. We define validation here instead of on models so that we can do each job better*
  
  * **`object.validator.js`**
    *e.g., `user.validator.js`*
    


# Syntax Help

This is a lot of vanilla syntax I use for each type of file.

### `Package.json`

These run scripts are used quite often in my projects. I explain them below.

```
"scripts": {
    "devstart": "export NODE_ENV=development && DEBUG=app:* nodemon app.js",
    "generate": "export NODE_ENV=development && DEBUG=app:db,app:generator node"
  },
```

* `devstart`: 
  
  > This is the typical function used during development. It first sets the envronment to development, and then enables **all** debugging namespaces, and then runs the driver file.

* `generate`:
  
  > This script is used to run standalone generator files. It first sets the environment to development, and then enables database, and generator debugging namespaces. Lastly it ends with `node` with no file name. This is because the files name should be provided with the `--` marker in the cli like so: `npm run generate -- generators/users.generator.js`

### `config/*.json`

These files are just basic `.json` files that usually start with settings like this.

```
{
    "port": "3000",
    "dbUrl": "mongodb://localhost/users"
}
```

* `port`: 
  
  > This tells the config files what port to use, usually with a default of a hard-coded numbered port.

* `dbUrl`:
  
  > This tells the config files what the url is for the Mongo DB in that particular environment

### `app.js`

This is a typical starter template for an app.js:

```
const express = require('express');
const config = require('config');
const basicLog = require('easy-log')('app:basic');
const dbLog = require('easy-log')('app:db');
const stepsLog = require('easy-log')('app:steps');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect(config.get('dbUrl'), { useNewUrlParser: true })
    .then(() => { dbLog(`Mongod DB connected successfully`); })
    .catch((err) => { dbLog(`Mongo DB could not connect: ${err}`); });

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const usersRouter = require('./routers/user.router');

app.use((req, res, next) => {
    stepsLog();
    next();
})

app.use('/api/user', usersRouter);

app.use((req, res, next) => {
    stepsLog();
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    stepsLog()
    res.status(err.status || 500);
    res.send('Error: ' + err.message);
});

app.listen(config.get('port'), () => {
    basicLog(`App listening on port ${config.get('port')}`);
});
```

This file does a number of things in order.

* Imports all required modules.
  
  > These are all the modules and functions created from modules that we will need. Notice the separate debugging log functions. This is done by convention so as the application scales, the debugging can be separated and watched carefully.
* Connects to the Mongo DB.
  
  > In order to prevent from needing to connect to the database for every database file, we just connect once here when the app initially runs.
  
* Creates the app object from express.
  
  > This app object is what everything else in the project will run through as request are recieved and responses are sent.
  
* Sets up basic middleware.
  
  > We put all our middleware before the rest of the routes so they will be used on every request that comes throught. Here we are parsing the body of `POST` requests, so that we can access them later in controller files
  
* Imports a custom router object.
  
  > Now we begin to import our own files, such as this router, in order to use them.
  
* Set up our own custom middleare.
  
  > Once we import the router, we can use it as our middleware for the appropriate requests
  
* Tell our app to listen 
  
  > We get our port from the `config` module's files and then log out a success message using `basicLog`

### `models/*.model.js`

```
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        required: true
    }
})

const User = mongoose.model('User', UserSchema);
module.exports = User;
```

### `validators/*.validator.js`

```
const Joi = require('joi');
const stepsLog = require('easy-log')('app:steps');

module.exports.isValid = function (obj) {
    stepsLog();
    const schema = Joi.object().keys({
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isAdmin: Joi.boolean()
    });

    return Joi.validate(obj, schema, { stripUnknown: true });
}
```

### `controllers/*.controller.js`

```
// node_modules requires //

const user = require('../models/user.model');
const dbLog = require('easy-log')('vidly:db');
const stepsLog = require('easy-log')('vidly:steps');
const validateLog = require('easy-log')('vidly:validate');

const userValidator = require('../validators/user.validator');

module.exports.create = async (req, res, next) => {
    stepsLog();

    const { error, value } = userValidator.isValid(req.body);

    if (error) {
        validateLog(error.details[0].message);
        const err = new Error(error.details[0].message);
        err.status = 500;
        return next(error);
    }

    const user = new user({
        name: value.name,
        isGold: value.isGold,
        phone: value.phone,
        roles: value.roles
    });
    try {
        const newuser = await user.save();
        dbLog(`user was successfully saved to the database. user: \n${newuser}`);
        res.json(newuser);
    } catch (err) {
        const error = new Error(err.message);
        error.status = 500;
        dbLog(`There was an error saving the user: ${error}`);
        return next(error);
    }
}

module.exports.readAll = async (req, res, next) => {
    stepsLog();
    try {
        let users;
        if (req.query.sortBy) {
            users = await user.find().sort(req.query.sortBy);
        } else {
            users = await user.find();
        }
        dbLog(`users were successfully retrieved from the database.`);
        res.json(users);
    } catch (err) {
        const error = new Error(err.message);
        error.status = 500;
        dbLog(`There was an error finding the user: ${error}`);
        return next(error);
    }
}

module.exports.read = async (req, res, next) => {
    stepsLog();
    try {
        const user = await user.findById(req.params.id);
        dbLog(`user was successfully retrieved from the database. user: \n${user}`);
        res.json(user);
    } catch (err) {
        const error = new Error(err.message);
        error.status = 500;
        dbLog(`There was an error finding the user: ${error}`);
        return next(error);
    }
}

module.exports.update = async (req, res, next) => {
    stepsLog();
    try {
        const user = await user.findById(req.body.id);
        dbLog(`user was successfully retrieved from the database. user: \n${user}`);
        const newuser = {
            name: req.body.name || user.name,
            isGold: req.body.isGold || user.isGold,
            phone: req.body.phone || user.phone,
            roles: req.body.roles || user.roles
        };
        const { error, value } = userValidator.isValid(newuser);
        if (error) {
            const err = new Error(error.details[0].message);
            err.status = 400;
            validateLog(err);
            return next(err);
        }
        const updateduser = await user.findOneAndUpdate(req.body.id, value, { new: true });
        dbLog(`user was successfully updated in the database. user: \n${updateduser}`);
        res.json(updateduser);
    } catch (err) {
        const error = new Error(err.message);
        error.status = 500;
        dbLog(`There was an error updating the the user. ${error}`);
        return next(error);
    }
}

module.exports.destroy = async (req, res, next) => {
    stepsLog();
    try {
        const user = await user.findByIdAndDelete(req.body._id);
        dbLog(`user: ${user} was successfully deleted`);
        res.json(user);
    } catch (err) {
        const error = new Error(err.message);
        error.status = 500;
        dbLog(`There was an error deleting the user. ${error}`);
        return next(error);
    }
}
```

### routers/*.router.js

```
const express = require('express');
const stepsLog = require('easy-log')('vidly:steps');

const router = express.Router();

const userController = require('../controllers/user.controller');

router.use((req, res, next) => {
    stepsLog();
    next();
})

// Post routes
router.post('/', userController.create);

// Get routes
router.get('/', userController.readAll);
router.get('/:id', userController.read);

// Put routes
router.put('/', userController.update);

// Delete routes
router.delete('/', userController.destroy);

module.exports = router;
```

### generators/*s.generator.js

```
const mongoose = require('mongoose');
const config = require('config');
const dbLog = require('easy-log')('vidly:db');
const generatorLog = require('easy-log')('vidly:generator');

mongoose.connect(config.get('dbUrl'))
    .then(() => { dbLog(`Mongod DB connected successfully`); })
    .catch((err) => { dbLog(`Mongo DB could not connect: ${err}`); });

const user = require('../models/user.model');

const createuser = async (properties) => {
    const user = new user({
        name: properties.name,
        isAdmin: properties.isGold,
        phone: properties.phone
    })
    try {
        const newuser = await user.save();
        generatorLog(`New user: ${newuser}`);
    } catch (err) {
        generatorLog(`There was an issue generating the following user: ${user}. Error: ${err}`);
    }
}

const users = [
    ["Daniel", false, "3176617899"],
    ["Rachel", true, "3178693378"],
    ["John", false, "3174138050"],
    ["Susan", false, "3178092584"],
    ["Wesley", true, "3178099103"]
]

for (let index in users) {
    createuser({
        name: users[index][0],
        isAdmin: users[index][1],
        phone: users[index][2]
    })
}
```

