var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SessionSchema   = new Schema({
    cookie      : { type: String , unique: true, required: true, dropDups: true },
    expires     : { type: Date , required: true }
});


module.exports = mongoose.model('Session', SessionSchema);