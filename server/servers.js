var config = require('./configuration.js').setupConfig();
var mysql = require('mysql');
var redis = require('redis');
var utilities = require('./utilities.js');

module.exports = {
  mySqlInit : (function mysqlInit() {  // MetaX - Semantic DB Connection
    var pool = mysql.createPool({
      connectionLimit : config.mySQLconnectionLimit, //important
      host     : config.mySQL.host,
      user     : config.mySQL.user,
      password : config.mySQL.password,
      database : config.mySQL.database,
      port     : config.mySQL.port,
      debug    : config.mySQL.debug
    });
    utilities.log({"INIT: ": "Created mySql connection pool"});
    return pool;
  }),
  mySqlQuery : (function mySqlQuery(pool, query, cb, dbRedis) {  //MetaX Query Call
    pool.getConnection(function(err,connection){
      if (err) {
        connection.release();
        utilities.logError({"CONNECTION" : "mySQL", "status" : "Error in connection database"});
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
        utilities.logError({"CONNECTION" : "mySQL", "status" : "Error in connection database"});
        return;
      });
    });
  }),
  redisInit : (function redisInit(cb) { // Redis - In Memory DB Connection
      var redisConnection = redis.createClient(config.redis.port, config.redis.host);

      redisConnection.auth(config.redis.password, function() {
        utilities.log({"INIT: " : "Redis client connected"});
        setTimeout(function() {
          redisConnection.set("signal_stop","false");
        }, config.redisRefresh);
        redisConnection.set("synchronization_tasks",0);
        if (config.redisFlush) {
          redisConnection.flushall( function() {
            utilities.log({"INIT: " : "Redis Flushed"});
            cb(redisConnection);
          });
        } else {
            cb(redisConnection);
        }
      });
      redisConnection.on("error", function (err) {
        utilities.logError({"CONNECTION" : "Redis", "status" : "Redis Error"});
          return(err);
    });
  })
};
