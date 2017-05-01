const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const passport = require('passport');
const session = require('express-session');
const config = require('./server/config/env');
const routes = require('./server/routes/index.route');
const auth = require('./server/services/user/auth.service');
const errors = require('./server/middleware/errors');
const serverWare = require('./server/middleware/server');
const socketServer = require('./server/controllers/sockets.controller');

const app = express();

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'filamental'
}));

app.use(passport.initialize());
app.use(passport.session());
app.engine('mustache', require('hogan-middleware').__express);
app.set('port', process.env.PORT || config.port);
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'mustache');

app.use(cookieParser());
app.use(compress());
// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(serverWare.status);

app.use('/', routes);

auth.set(passport);

// Custom Middleware
app.use(errors.errors);


const server = app.listen(config.port, () => {
    console.log(`server started on port ${config.port} (${config.env})`);
});

// Activate websockets
socketServer.init(server);

module.exports = app;
