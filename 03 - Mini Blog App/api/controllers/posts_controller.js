const Post = require('../models/post');

exports.delete = (req, res, next) => {
	Post.findByIdAndRemove(req.params.id)
		.exec((err) => {
			if(err) { return next(err); }
			res.end();
		});
};

exports.create = (req, res, next) => {
	Post.create({
		title: req.body.title,
		body: req.body.body
	}, (err, post) => {
		if (err) {
			return next(err);
		}
		res.end();
	});
};

exports.get_post = (req, res, next) => {
	Post.findById(req.params.id, (err, post) => {
		if (err) { return next(err); }
		res.json(post)
	});
};

exports.update_post = (req, res, next) => {
	Post.findById(req.params.id, (err, post) => {
		if(err) {
			return next(err);
		}
		post.title = req.body.title;
		post.body = req.body.body;
		post.save((err, post) => {
			if(err) { return next(err) }
			res.end();
		});
	});
};