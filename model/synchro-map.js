var app = require('../server/app.js');
var utilities = require('../server/utilities.js');
var config = require('../server/configuration.js');
var servers = require('../server/servers.js');

// Synchronization: SEMANTICS (Redis SET)
function redis_semantics(res, dbRedis) {
  var redis = dbRedis;
  res.forEach(function(row) {
    redis.sadd("semantics" , row.semantics, redis.print); // Create List
  });
  // redis.sdiff("semantics_temp", "semantics", function(err, res){
  //   redis.sadd("semantics",res);
  // });
  synchronizationTasksDone(redis);
  utilities.log({SYNC : "redis_semantic", status : "SYNCHRONIZED " + res.length.toString() + " records"}, 'f');
}

// Synchronization: ENTITIES (Redis SET + Hashes)
function redis_entity(res, dbRedis) {
  var redis = dbRedis;
  res.forEach(function(row) {
    switch (row.sId) {
      case 1001:
        redis.hmset("industry:"+row.eId,"name", row.entity);
        break;
      case 1002:
        redis.hmset("methodology:"+row.eId,"name", row.entity);
        break;
      case 1003:
      redis.hmset("diagram type:"+row.eId,"name", row.entity);
        break;
      case 1004:
      redis.hmset("file extension:"+row.eId,"name", row.entity);
        break;
      case 1006:
      redis.hmset("audience:"+row.eId,"name", row.entity);
        break;
      case 1007:
      redis.hmset("collection:"+row.eId,"name", row.entity);
        break;
    }
    redis.sadd("semantic entities", row.eId, redis.print);
  });
  synchronizationTasksDone(redis);
  utilities.log({SYNC : "redis_entity", status : "synchronized " + res.length.toString() + " records"}, 'f');
}

function synchronizationTasksDone(redis) {
  redis.incr("synchronization_tasks");
}

// Mappings
module.exports = [
  {
    query : 'SELECT `Semantic ID` AS "sId", `Semantic Name` AS "semantics" FROM metaindex_semantic WHERE `Semantic Category ID` = 1000 ORDER BY `Semantic Name`;',
    callback : redis_semantics
  },{
    query : 'SELECT `Entity ID` AS "eId", `Entity Name` AS "entity" , `Semantic ID` AS "sId" FROM metasystem_entity ORDER BY `Semantic ID` , `Entity Name`;',
    callback : redis_entity
  }
];
