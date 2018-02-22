
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('errorhandler'),
  morgan = require('morgan'),
  routes = require('./routes'),
  partials = require('./routes/partials'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');
  mailer = require('express-mailer'),
  mongoose   = require('mongoose');

var app = module.exports = express();


const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

/**
 * Configuration
 */
console.log('Running app');
// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());

var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
  app.use(errorHandler());
}

// production only
if (env === 'production') {
  // TODO
    app.use(errorHandler());
}

// Express Mailer configuration
mailer.extend(app, {
  from: 'username@gmail.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'username',
    pass: 'password'
  }
});

// Mongoose configuration
// Use your own configuration
mongoose.connect(process.env.MONGODB_URI || 'mongodb://william:root@localhost:27017/sleepear');

app.use(session({
    key: 'user_sid',
    secret: 'foo',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        switch (req.session.user.job) {
            case 'patient':
                if(req.path !== '/partials/breaths/index.html' && req.path !== '/partials/breaths/submit.html' && req.path !== '/partials/index.html') {
                    res.redirect('/partials/breaths/index.html');
                }
                break;
            default:
                if(req.path !== '/partials/index.html' && req.path !== '/partials/login.html' && req.path !== '/partials/register.html') {
                    res.redirect('/partials/index.html');
                }
        }
    } else {
        if(req.path !== '/partials/index.html' && req.path !== '/partials/login.html' && req.path !== '/partials/register.html') {
            res.redirect('/partials/index.html');
        }
        next();
    }
};

/**
 * Routes
 */

// serve index  
app.use('/', routes);

// server view partials
app.use('/partials', sessionChecker, partials);

// JSON API
app.use('/api', api);

// redirect all others to the index (HTML5 history)
app.get('*', function(req, res, next) {
  res.render('index');
});

/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
