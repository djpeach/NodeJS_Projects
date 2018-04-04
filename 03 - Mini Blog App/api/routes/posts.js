const express = require('express');
let router = express.Router();

const posts_controller = require('../controllers/posts_controller');

// (Read) Get an existing post's info
router.get('/:id', posts_controller.get_post);

// (Creat) Create a new post
router.post('/', posts_controller.create);

// (Delete) Delete an existing post
router.delete('/:id', posts_controller.delete);

// (Update) Update an existing post
router.put('/:id', posts_controller.update_post)


module.exports = router;