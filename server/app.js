var servers = require('./servers.js');
var utilities = require('./utilities.js');
var synchroMap = require('../model/synchro-map.js');
var config = require('./configuration.js');
var moment = require('moment');

var dbSql = servers.mySqlInit();
var dbRedis;
// var res;

servers.redisInit(startSynchronization);

// Start Synchronisation
function startSynchronization(redis) {
  dbRedis = redis;
  console.log('--------------------------------');
  console.log('--mySql>Redis-SYNCHRONIZATION---');
  console.log('--------------------------------');
  synchroMap.forEach(function(map) {
    // Asynchronous synchronization
    // setTimeout(function() {
      mySqlQuery(map.query, map.callback, redis);
    // }, 100);
  });
  setTimeout(function() {
    nextSynchro(redis,synchroMap.length);
  }, config.parameters.redisRefresh);
  utilities.log({SYNC : "Submited all synchronization maps", status : "done"}, 'f');
}

// Execute Query on MetaX
function mySqlQuery(query, cb, dbRedis) {
  try {
    var res = servers.mySqlQuery(dbSql, query ,cb ,dbRedis);
  } catch (err) {
    utilities.logError({"mySQLQuery" : "Can't execute", "Error: " : err});
  }
}

function nextSynchro(redis,tasksCount){  //Wait for next Synchronisation
  redis.get("synchronization_tasks",function(err, tasksDone) {
    if(tasksDone == tasksCount) {
      redis.get("signal_stop",function(err, stopSignal) {
            if(err) {
              utilities.logError({"Signal to Stop" : "Can't execute", "Error: " : err});
            } else {
              if (stopSignal == 'false') {
                utilities.log({SYNC : "WAIT", status : "wait for next synchronization... "}, 'w');
                setTimeout(function() {
                  redis.set("synchronization_tasks",0);
                  startSynchronization(redis);
                }, config.parameters.redisRefresh);
              } else {
                utilities.log({SYNC : "STOP", status : "RECEIVED SIGNAL TO STOP"}, 'q');
                closeConnections(dbSql, redis);
              }
            }
          });
    } else {
      utilities.log({SYNC : "Waiting to finish all tasks", status : "done"}, 'w');
      setTimeout(function() {
        nextSynchro(redis,tasksCount);
      }, config.parameters.redisRefresh);
    }
  });
}


// Close all Connections
function closeConnections(mySqlConnection, redisConnection) {
  mySqlConnection.end();
  redisConnection.quit();
  utilities.log({SYNC : "STOP", status : "All Connections are closed, can't wait to start again :)"}, 'q');
}
