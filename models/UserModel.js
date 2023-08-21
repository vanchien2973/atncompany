var mongoose = require('mongoose');
var roles = require('../utils/roles');


var UserSchema = mongoose.Schema({
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    role: {type: String, enum: [roles.admin, roles.user], default: roles.user }
})

UserSchema.methods.isValidPassword = function (password) {
    return this.password === password;
};

var adminEmail = "admin@gmail.com"
UserSchema.pre('save', function(next) {
    if (this.email === adminEmail.toLowerCase()) {
        this.role = roles.admin;
    }
    next();
});

var UserModel = mongoose.model('user', UserSchema, 'user')

module.exports = UserModel