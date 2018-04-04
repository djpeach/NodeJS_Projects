const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

var AuthorSchema = new Schema({
	first_name: {type: String, required: true, max: 100},
	last_name: {type: String, required: true, max: 100},
	birth_date: {type: Date},
	death_date: {type: Date}
});

AuthorSchema.virtual('name').get( function(){ return `${this.last_name}, ${this.first_name}` });
AuthorSchema.virtual('url').get( function(){ return `/catalog/author/${this._id}`});
AuthorSchema.virtual('birth_date_formatted').get( function() { return this.birth_date ? `${moment(this.birth_date).format('MMMM Do, YYYY')}` : ''; });
AuthorSchema.virtual('death_date_formatted').get( function() { return this.death_date ? ` - ${moment(this.death_date).format('MMMM Do, YYYY')}` : ''; });

module.exports = mongoose.model('Author', AuthorSchema);