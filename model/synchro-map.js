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
      case 1006:
      redis.hmset("audience:"+row.eId,"name", row.entity);
        break;
      case 1007:
      redis.hmset("collection:"+row.eId,"name", row.entity);
        break;
      case 1008:
      redis.hmset("language:"+row.eId,"name", row.entity);
        break;
      case 1010:
      redis.hmset("play mode:"+row.eId,"name", row.entity);
        break;
      case 1011:
      redis.hmset("activity mode:"+row.eId,"name", row.entity);
        break;
    }
    redis.sadd("semantic entities", row.eId, redis.print);
  });
  synchronizationTasksDone(redis);
  utilities.log({SYNC : "redis_entity", status : "synchronized " + res.length.toString() + " records"}, 'f');
}

// Synchronization: Authors (Redis SET + Hashes)
function redis_author(res, dbRedis) {
  var redis = dbRedis;
  res.forEach(function(row) {
    redis.hmset("author:"+row.aId, "first name", row.fName,"last name", row.lName, "address", row.address);
    redis.sadd("authors", row.aId, redis.print);
  });
  synchronizationTasksDone(redis);
  utilities.log({SYNC : "redis_authors", status : "synchronized " + res.length.toString() + " records"}, 'f');
}

// Synchronization: Public and Published Diagrams (Redis SET + Hashes)
function redis_public_and_published_diagram(res, dbRedis) {
  var redis = dbRedis;
  res.forEach(function(row) {
    redis.hmset("diagram:"+row.dId, "author id", row.aId,"diagram name", row.dName, "diagram description", row.dDescription, "diagram status", row.dStatus);
    redis.sadd("diagrams", row.dId, redis.print);
  });
  synchronizationTasksDone(redis);
  utilities.log({SYNC : "redis_diagrams", status : "synchronized " + res.length.toString() + " records"}, 'f');
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
  },{
    query : 'SELECT `Composition ID` AS "aId", `Composition First Name` AS "fName" , `Composition Last Name` AS "lName" , `Composition Address` AS "address" FROM pattern_composition ORDER BY `Composition ID` , `Composition Last Name` , `Composition First Name`;',
    callback : redis_author
  },{
    query : 'SELECT D2. `Composition ID` AS "aId",  D1. `Member ID` AS "dId", D1.`Member Name` AS "dName", IFNULL(D1.`Member Description`,"") AS "dDescription", IFNULL(D1.`Member Status ID`,"") AS "dStatus" FROM `odmetax`.`Pattern_Composition_Members` D2, `odmetax`.`Pattern_Composition_Members_Detail` D1 WHERE D2.`Member ID` = D1.`Member ID` ORDER BY D1.`Member Name`;',
    callback : redis_public_and_published_diagram
  }
];
