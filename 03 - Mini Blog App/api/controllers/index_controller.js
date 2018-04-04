const Post = require('../models/post');

exports.index_get = (req, res, next) => {
	Post.find().exec((err, all_posts) => {
		if(err) { return next(err) };
		res.json(all_posts);
	});
};
