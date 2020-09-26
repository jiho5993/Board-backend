var mysql = require("mysql");

module.exports = function () {
  return {
    /**
     * host: 호스트
     * port: 포트
     * user: 유저의 이름
     * password: 패스워드
     * database: 스키마
     * dateStrings: format을 사용하지 않고 datetime을 YYYY-MM-DD HH:mm:ss 형식으로 가져옴
     */
    init: function () {
      return mysql.createConnection({
        host: "localhost",
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
        dateStrings: "date",
      });
    },

    test: function (con) {
      con.connect(function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Mysql database is connected successfully.");
        }
      });
    },
  };
};
