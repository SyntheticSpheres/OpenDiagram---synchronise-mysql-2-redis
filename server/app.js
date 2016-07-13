var servers = require('./servers.js');
var utilities = require('./utilities.js');
var moment = require('moment');

var dbSql = servers.mySqlInit();
var dbRedis;
var res;

servers.redisInit(startSynchornization);

// Start Synchronisation
function startSynchornization(redis) {
  dbRedis = redis;
  console.log('-------------------------------');
  console.log('--START-Redis-SYNCHRONIZATION--');
  console.log('-------------------------------');
  mySqlQuery("SELECT * FROM odmetax.metaindex_semantic;", xyz);
}

// Execute Query on MetaX
function mySqlQuery(query, cb) {
  try {
    res = servers.mySqlQuery(dbSql, query ,cb);
    // console.log(res);
  } catch (err) {
    utilities.logError({"mySQLQuery" : "Can't execute", "Error: " : err});
  }
}

function xyz(ret) {
  // console.log(ret);
  console.log('finish');
  console.log(ret[0]);
  utilities.log({Query : "s", status : "done"});

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

// console.log('GO');
// synchronise();


// Promise.all([function1, function2]).then({...}) where function1 and function2 have
// return request({...})


// Close all Connections
// servers.dbSQL.end();
// redisConnection.quit();
