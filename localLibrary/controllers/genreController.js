const Genre = require('../models/genre');
const Book = require('../models/book');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const async = require('async');

// Display list of all Genre.
exports.genre_list = function(req, res, next) {
    Genre.find()
    	.sort([['name', 'ascending']])
    	.exec((err, list_genres) => {
    		res.render('genre_list', {title: 'Genre List', genre_list: list_genres});
    	});
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {
    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id)
                .exec(callback)
        },
        genre_books: function(callback) {
            Book.find({'genre': req.params.id})
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.genre==null) {
            let err = new Error('Genre not found');
            err.status = 404;
            return next(err)
        }
        res.render('genre_detail', {title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books});
    });
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res, next) {
    res.render('genre_form', {title: 'Create Genre'});
};

// Handle Genre create on POST.
exports.genre_create_post = [
    // List out the validators, which will create errors if the items do not validate.
    // These errors will be stored in the validationResult

    // This will check that the 'name' input has a value
    body('name', 'Genre name required').trim().isLength({min: 1}),
    // This now sanitzes the items in the body before we use it to create a new Genre
    sanitizeBody('name').trim().escape(),

    // This is an anon function that will do the logic based on the values and/or errors created.
    (req, res, next) => {
        const errors = validationResult(req);
        let genre = new Genre({
            name: req.body.name
        });
        if (!errors.isEmpty()) {
            res.render('genre_form', {title: 'Create Genre', genre: genre, errors: errors.array()});
        return;
        } else {
            Genre.findOne({'name': req.body.name})
                .exec(function(err, found_genre) {
                    if (err) { return next(err); }
                    if (found_genre) {
                        res.render('genre_form', {title: 'Create New Genre', genre: genre, existing_genre: found_genre});
                    } else {
                        genre.save(function(err) {
                            if (err) { return next(err); }
                            res.render('genre_form', {title: 'Create New Genre', genre: genre, new_genre: genre})
                        });
                    }
                });
        }
    }
];

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};