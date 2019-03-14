const express = require('express');
const path = require('path');
const logger = require('morgan');
const debug = require('debug')('api:server');
const indexRouter = require('./routes/index');
const http = require('http');
const port = process.env.PORT || '5000';
const app = express();

app.set('port', port);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

const server = http.createServer(app);
server.listen(port);
server.on('listening', () =>  {
    debug('Listening on ' + port);
});

