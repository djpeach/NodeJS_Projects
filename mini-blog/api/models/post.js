const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let PostSchema = new Schema({
	title: {type: String, required: true, max: 100},
	body: {type: String, required: true}
});

module.exports = mongoose.model('Posts', PostSchema);