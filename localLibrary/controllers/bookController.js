const Book = require('../models/book');
const BookInstance = require('../models/bookInstance');
const Author = require('../models/author');
const Genre = require('../models/genre');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const async = require('async');

// Display list of all books.
exports.book_list = function(req, res, next) {
    Book.find({}, 'title author')
    	.populate('author')
    	.exec((err, list_books) => {
    		if (err) {
    			return next(err);
    		}
    		res.render('book_list', {title: 'Book List', book_list: list_books});
    	});
};

// Display detail page for a specific book.
exports.book_detail = function(req, res) {
    async.parallel({
        book: function(callback) {
            Book.findById(req.params.id)
                .populate('author')
                .populate('genre')
                .exec(callback)
        },
        book_instances: function(callback) {
            BookInstance.find({'book': req.params.id})
                .exec(callback)
        },
    }, (err, results) => {
        if (err) { return next(err); }
        if (results.book==null) {
            let err = new Error('Book Instance not found');
            err.status = 404;
            return next(err);
        }
        res.render('book_detail', {title: 'Book Detail', book: results.book, book_instances: results.book_instances});
    });
};

// Display book create form on GET.
exports.book_create_get = function(req, res) {
    async.parallel({
        all_authors: (callback) => {
            Author.find(callback);
        },
        all_genres: (callback) => {
            Genre.find(callback);
        },
    }, (err, results) => {
        if (err) { return next(err); }
        res.render('book_form', {title: 'Create Book', all_authors: results.all_authors, all_genres: results.all_genres});
    });
};

// Handle book create on POST.
exports.book_create_post = [
    (req, res, next) => {console.log(req.body.genre); next();},
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined'){
                req.body.genre = []
            } else {
                req.body.genre = new Array(req.body.genre)
            }
        }
        next();
    },
    (req, res, next) => {console.log(req.body.genre); next();},

    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
    body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
    body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim(),

    sanitizeBody('*').trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        let book = new Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre
        });
        if (!errors.isEmpty()) {
            async.parallel({
                all_authors: (callback) => {
                    Author.find(callback);
                },
                all_genres: (callback) => {
                    Genre.find(callback);
                },
            }, (err, results) => {
                if (err) { return next(err); }

                for (let i = 0; i < results.all_genres.length; i++) {
                    // If the genre exists in the created book, then when we check for its
                    // index, based on all the genres, it will be greater than -1, so we know
                    // we want it selected.
                    if (book.genre.indexOf(results.all_genres[i]._id) > -1) {
                        results.all_genres[i].checked='true';
                    }
                }
                res.render('book_form', {title: 'Create Book', all_authors: results.all_authors, all_genres: results.all_genres, book: book, errors: errors.array()});
            });
        } else {
            Book.findOne({'title': req.body.title, 'author': req.body.author})
                .exec((err, found_book) => {
                    if (err) { return next(err); }
                    if (found_book) {
                        async.parallel({
                            all_authors: (callback) => {
                                Author.find(callback);
                            },
                            all_genres: (callback) => {
                                Genre.find(callback);
                            },
                        }, (err, results) => {
                            if (err) { return next(err); }
                            res.render('book_form', {title: 'Create Book', all_authors: results.all_authors, all_genres: results.all_genres, existing_book: found_book});
                        });
                    } else {
                        book.save((err) => {
                            if(err) { 
                                return next(err); 
                            } else {
                                async.parallel({
                                    all_authors: (callback) => {
                                        Author.find(callback);
                                    },
                                    all_genres: (callback) => {
                                        Genre.find(callback);
                                    },
                                }, (err, results) => {
                                    if (err) { return next(err); }
                                    res.render('book_form', {title: 'Create Book', all_authors: results.all_authors, all_genres: results.all_genres, created_book: book});
                                });
                            }
                        });
                    }
                });
        }
    }
];

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};