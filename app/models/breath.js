var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BreathSchema   = new Schema({
	name: String,
    type: String
});

module.exports = mongoose.model('Breath', BreathSchema);