var app = require('../server/app.js');
var utilities = require('../server/utilities.js');

function redis_semantics(res, dbRedis) {

// console.log(dbRedis);

  res.forEach(function(row) {
    console.log('RPUSH ' + row.semantics);
    // dbRedis.redisClient.rpush("semantics:" + row.sId, row.semantics, redis.print);
  });
  utilities.log({SYNC : "redis_semantic", status : "synchronized " + res.length.toString() + " records"}, 'f');
}

function redis_entity(res, dbRedis) {
  res.forEach(function(row) {
    console.log('RPUSH ' + row.semantics);
    // dbRedis.rpush("semantics:" + row.sId, row.semantics, redis.print);
  });
  utilities.log({SYNC : "redis_entity", status : "synchronized " + res.length.toString() + " records"}, 'f');
}

// query : callback function
module.exports = [
  {
    query : 'SELECT `Semantic Name` AS "semantics" FROM odmetax.MetaIndex_Semantic WHERE `Semantic Category ID` = 1000 ORDER BY `Semantic Name`',
    callback : redis_semantics
  },{
    query : 'SELECT * FROM odmetax.metasystem_entity;',
    callback : redis_entity
  }
];
