var express = require('express');
var path = require('path');
var logger = require('morgan');
const debug = require('debug')('api:server');
const http = require('http');
const port = process.env.PORT || '3000';
var sassMiddleware = require('node-sass-middleware');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res) {
    res.render('notFound');
});

// error handler
app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error');
});

const server = http.createServer(app);
server.listen(port);
server.on('listening', () =>  {
    debug('Listening on ' + port);
});
