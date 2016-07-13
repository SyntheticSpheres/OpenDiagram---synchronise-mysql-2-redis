var app = require('../server/app.js');
var utilities = require('../server/utilities.js');

// Synchronizations
function redis_semantics(res, dbRedis) {
  var redis = dbRedis;
  res.forEach(function(row) {
    redis.rpush("semantics:" + row.sId, row.semantics, redis.print);
  });
  utilities.log({SYNC : "redis_semantic", status : "synchronized " + res.length.toString() + " records"}, 'f');
}

function redis_entity(res, dbRedis) {
  var redis = dbRedis;
  res.forEach(function(row) {
    redis.rpush("entity:" + row.eId, row.entity, redis.print);
  });
  utilities.log({SYNC : "redis_entity", status : "synchronized " + res.length.toString() + " records"}, 'f');
}

// Mappings
module.exports = [
  {
    query : 'SELECT `Semantic ID` AS "sId", `Semantic Name` AS "semantics" FROM odmetax.MetaIndex_Semantic WHERE `Semantic Category ID` = 1000 ORDER BY `Semantic Name`;',
    callback : redis_semantics
  },{
    query : 'SELECT `Entity ID` AS "eId", `Entity Name` AS "entity" FROM odmetax.metasystem_entity ORDER BY `Entity Name`;',
    callback : redis_entity
  }
];
