const Author = require('../models/author');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const async = require('async');
var original_dates = {};

exports.author_list = (req, res, next) => {
	Author.find()
		.sort([['last_name', 'ascending']])
		.exec((err, list_authors) => {
			if (err) {
				return next(err);
			}
			res.render('author_list', {title: 'Author List', author_list: list_authors});
		});
};

// Display detail page for a specific Author.
exports.author_detail = function(req, res, next) {
	async.parallel({
		author: (callback) => {
			Author.findById(req.params.id)
				.exec(callback)
		},
		author_books: (callback) => {
			Book.find({'author': req.params.id})
				.sort([['title', 'ascending']])
				.exec(callback)
		},
	}, (err, results) => {
		if (err) { return next(err) };
		if (results.author==null) {
			let err = new Error('Author not found');
			err.status = 404;
			return next(err);
		}

		res.render('author_detail', {title: 'Author Detail', author: results.author, author_books_list: results.author_books});
	});
};

// Display Author create form on GET.
exports.author_create_get = (req, res, next) => {
	res.render('author_form', {title: 'Create Author'});
}
// Handle Author create on POST.
exports.author_create_post = [
	//Validate fields, storing any errors in the validationResult
	body('first_name').isLength({min:1}).trim().withMessage('First name must be specified')
		.isAlphanumeric().withMessage('First name must only have letters'),
	body('last_name').isLength({min:1}).trim().withMessage('Last name must be specified')
		.isAlphanumeric().withMessage('Last name must only have letters'),

	//Sanitize fields, and structure them correctly to be used to create new Author
	sanitizeBody('first_name').trim().escape(),
	sanitizeBody('last_name').trim().escape(),
	(req, res, next) => {
		original_dates = {
			birth_date: req.body.birth_date,
			death_date: req.body.death_date
		};
		next();
	},
	sanitizeBody('birth_date').trim().escape(),
	sanitizeBody('death_date').trim().escape(),

	(req, res, next) => {
		// Get the errors from the validation on the request
		const errors = validationResult(req);
		let author = new Author({
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			birth_date: req.body.birth_date,
			death_date: req.body.death_date
		});

		if(!errors.isEmpty()) {
			res.render('author_form', {title: 'Create Author', author: req.body, original_dates: original_dates, errors: errors.array() });
			return;
		} else {
			Author.findOne({'first_name': req.body.first_name, 'last_name': req.body.last_name})
				.exec((err, found_author) => {
					if (err) { return next(err) };
					if (found_author) {
						res.render('author_form', {title: 'Create Author', existing_author: found_author});
					} else {
						author.save((err) => {
							if (err) { return next(err); }
							res.render('author_form', {title: 'Create Author', created_author: author});
						});
					};
				});
		}
	}
];

// Display Author delete form on GET.
exports.author_delete_get = function(req, res, next) {
    async.parallel({
    	author: (callback) => { Author.findById(req.params.id).exec(callback) },
    	authors_books: (callback) => { Book.find({'author': req.params.id}).exec(callback) },
    }, (err, results) =>{
    	if (err) { return next(err); }
    	if (results.author==null) { res.redirect('/catalog/authors'); }
    	if (results.authors_books.length > 0) { 
    		res.render('author_delete', {author: results.author, authors_books: results.authors_books}); 
    	}
    	res.render('author_delete', {author: results.author});
    });
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res, next) {
    Author.findByIdAndRemove(req.body.authorid, (err) => {
    	if (err) { return next(err) }
    	res.redirect('/catalog/authors');
    });	
};

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};