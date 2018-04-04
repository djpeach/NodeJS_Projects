const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// --- Schema Definition ---
let UserSchema = new Schema({
    firstName:          { type: String, required: true },
    lastName:           { type: String, required: true },
    username:           { type: String, required: true, unique: true },
    email:              { type: String, required: true, unique: true  },
    password:           { type: String, required: true, bcrypt: true }
});

// --- Virtual Properties ---
UserSchema.virtual('fullName').get( function() {return `${this.firstName} ${this.lastName}`});

// --- Instance Methods ---
UserSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 11, (err, hash) => {
        if(err) {return next(err); }
        this.password = hash;
        next();
    });
});
UserSchema.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, result) {
        if(err) {
            let err = new Error('Error: models/user.js -> comparePassword() "Problem with comparing with bcrypt"');
            return cb(err);
        }
        return cb(null, result);
    })
}

// --- Static methods ---
UserSchema.statics.findUserByEmail = (email) => {
    return User.findOne({email: email}).exec();
}
UserSchema.statics.findUserByUsername = (username) => {
    return User.findOne({username: username}).exec();
}

let User = module.exports = mongoose.model('User', UserSchema);