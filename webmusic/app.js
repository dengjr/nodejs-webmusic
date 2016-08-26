var express = require('express');
var port = process.env.PORT || 3000;
var app = express();
var path = require('path');

var mongoose = require('mongoose');


var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongostore = require("connect-mongo")(session);
mongoose.connect('mongodb://localhost/music');

app.set('views','./views');
var bodyParser = require('body-parser');  
app.use(cookieParser());
app.use(session({
    secret: 'webmusic',
    store:new mongostore({
    	url:'mongodb://localhost/music',
    	collection:'sessions'
    })
}));
app.use(bodyParser.urlencoded({ extended: false })) ; 
app.use(bodyParser.json()) ; 
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','ejs');


require('./config/route')(app);

app.listen(port);

console.log('success on port '+ port);






