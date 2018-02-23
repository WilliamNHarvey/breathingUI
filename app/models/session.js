var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SessionSchema   = new Schema({
    _id         : { type: String , required: true },
    cookie      : { type: String, required: true, dropDups: true },
    expires     : { type: Date , required: true },
    user        : { type: String, unique: true }
});


module.exports = mongoose.model('Session', SessionSchema);