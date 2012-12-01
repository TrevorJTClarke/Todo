var mongoose = require( 'mongoose' );

var Todo = new mongoose.Schema({
    user_id    	: String,
    content    	: String,
    done   		: String,
    updated_at 	: Date
});
 
mongoose.model( 'Todo', Todo );
 
mongoose.connect('mongodb://trevor:1234sev@alex.mongohq.com:10065/todoly');
console.log('Connected to DB');

module.exports = Todo;