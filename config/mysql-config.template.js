var mysql = require('mysql');

module.exports = function() {
  return {
    init: function() {
      return mysql.createConnection({
        host: '',
        port: '',
        user: '',
        password: '',
        database: ''
      });
    },

    test: function(con) {
      con.connect(function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log("Mysql database is connected successfully.");
        }
      });
    }
  }
}