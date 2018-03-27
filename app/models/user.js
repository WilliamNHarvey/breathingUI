var mongoose     = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    email       : { type: String , unique: true, required: true, dropDups: true },
    password    : { type: String , required: true },
    status      : { type: Boolean, default: true },
    name        : { type: String, required: true },
    job         : { type: String , required: true, enum: ['patient', 'doctor', 'technician', 'visitor'] },
    session     : { type: String },
    connectedTo : { type: String, default: "" }
});

UserSchema.plugin(uniqueValidator, {message: 'e-mail taken.'});

module.exports = mongoose.model('User', UserSchema);