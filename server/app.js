var servers = require('./servers.js');
var utilities = require('./utilities.js');
var synchroMap = require('../model/synchro-map.js');
var moment = require('moment');

var dbSql = servers.mySqlInit();
var dbRedis;
// var res;

servers.redisInit(startSynchornization);

// Start Synchronisation
function startSynchornization(redis) {
  dbRedis = redis;
  console.log('--------------------------------');
  console.log('--START-Redis-SYNCHRONIZATION---');
  console.log('--------------------------------');
  synchroMap.forEach(function(map) {
    // Asynchronous synchronization
    // setTimeout(function() {
      mySqlQuery(map.query, map.callback, redis);
    // }, 100);
  });
  utilities.log({SYNC : "Submit all synchronization maps", status : "done"}, 'f');
}

// Execute Query on MetaX
function mySqlQuery(query, cb, dbRedis) {
  try {
    var res = servers.mySqlQuery(dbSql, query ,cb ,dbRedis);
  } catch (err) {
    utilities.logError({"mySQLQuery" : "Can't execute", "Error: " : err});
  }
}


function synchronise(servers) {
  var res;

  console.log('servers.dbSQL = ' + typeof(servers.dbSQL));

  // servers.dbSQL.query('SELECT `Semantic Name` AS "semantics" FROM MetaIndex_Semantic WHERE `Semantic Category ID` = 1000 ORDER BY `Semantic Name`', function(err, rows, fields) {
  //   if (err) throw err;
  //   rowCount = rows.length;
  //   console.log(rowCount + ' rows are returned');
  //   rows.forEach( function(row) {
  //     console.log('RPUSH ' + row.semantics);
  //     servers.dbRedis.rpush("semantics:" + row.sId, row.semantics, redis.print);
  //   });
  //   return 0;
  // });




  // Synchronise FILTER LIST
  res = new Promise(function(resolve, reject) {
    console.log('servers.dbSQL = ' + typeOf(servers.dbSQL));

    servers.dbSQL.query('SELECT `Semantic Name` AS "semantics" FROM MetaIndex_Semantic WHERE `Semantic Category ID` = 1000 ORDER BY `Semantic Name`', function(err, rows, fields) {
      if (err) throw err;
      rowCount = rows.length;
      console.log(rowCount + ' rows are returned');
      rows.forEach( function(row) {
        console.log('RPUSH ' + row.semantics);
        servers.dbRedis.rpush("semantics:" + row.sId, row.semantics, redis.print);
      });
      return 0;
    });
  }).then(function(cb) {
    servers.dbRedis.quit();
    servers.dbSQL.end();
    console.log('Server Connection closed');
  });
}

// Close all Connections
function closeConnections(mySqlConnection, redisConnection) {
  mySqlConnection.end();
  redisConnection.quit();
}
