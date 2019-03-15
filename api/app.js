const express = require('express');
const path = require('path');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const port = process.env.PORT || '5000';
const server = express();

server.set('port', port);
server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(express.static(path.join(__dirname, 'public')));
indexRouter(server);

server.listen(port, () => {
    process.stdout.write(`api listening on port ${port}`);
});

