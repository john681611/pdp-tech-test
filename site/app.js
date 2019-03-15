var express = require('express');
var path = require('path');
var logger = require('morgan');
const port = process.env.PORT || '3000';
var sassMiddleware = require('node-sass-middleware');

var indexRouter = require('./routes/index');

var server = express();

// view engine setup
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'hbs');

server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
}));
server.use(express.static(path.join(__dirname, 'public')));

server.use('/', indexRouter);

// catch 404 and forward to error handler
server.use('*', (req, res) => {
    res.status(404);
    res.render('notFound');
});

server.use((err, req, res) =>  {
    res.status(500);
    res.render('error');
});

server.listen(port, () => {
    process.stdout.write(`site listening on port ${port}`);
});