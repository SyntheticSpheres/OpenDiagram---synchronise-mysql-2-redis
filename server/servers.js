var config = require('./configuration.js');
var mysql = require('mysql');
var redis = require('redis');
var utilities = require('./utilities.js');

module.exports = {
  mySqlInit : (function mysqlInit() {  // MetaX - Semantic DB Connection
    var pool = mysql.createPool({
      connectionLimit : 100, //important
      host     : config.mySQL.host,
      user     : config.mySQL.user,
      password : config.mySQL.password,
      database : config.mySQL.databsse,
      port     : config.mySQL.port,
      debug    : false
    });
    utilities.log({"INIT: ": "Created mySql connection pool"});
    return pool;
  }),
  mySqlQuery : (function mySqlQuery(pool, query, cb, dbRedis) {  //MetaX Query Call
    pool.getConnection(function(err,connection){
      if (err) {
        connection.release();
        utilities.logError({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      connection.query(query, function(err,rows){
        connection.release();
        if(!err) {
          utilities.log({"Query" : query, "status" : (rows.length.toString() + " rows")});
          cb(rows, dbRedis);
        }
      });

      connection.on('error', function(err) {
        utilities.logError({"code" : 100, "status" : "Error in connection database"});
        return;
      });
    });
  }),
  redisInit : (function redisInit(cb) { // Redis - In Memory DB Connection
      var redisConnection = redis.createClient(config.redis.port, config.redis.host);

      redisConnection.auth(config.redis.password, function() {
        utilities.log({"INIT: " : "Redis client connected"});
        redisConnection.flushall( function() {
          utilities.log({"INIT: " : "Redis Flushed"});
          cb(redisConnection);
        });
      });
      redisConnection.on("error", function (err) {
        utilities.logError({"code" : 600, "status" : "Redis Error"});
          return(err);
    });
  })
};
