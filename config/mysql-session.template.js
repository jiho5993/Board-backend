var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

module.exports = (app) => {
  var sessionStore = new MySQLStore({
    host: '',
    port: '',
    user: '',
    password: '',
    database: ''
  });

  app.use(session({
    secret: "",
    resave: false,
    saveUninitialized: true,
    store: sessionStore
  }));
};