var chalk = require('chalk');

var parameters =
  { activeEnvironment : 'local',  // select environemnt = "local" or "remote"
    logToFile : false,            // Write log to file system
    redisFlush : true,            // Clear Redis Cache
    redisRefresh : 5000,          // Time interval to synchronize Redis
    environment: {
      local: {
        mySQL: {
          host     : '127.0.0.1',
          password : 'C0reattack',
          user     : 'admin',
          database : 'odmetax',
          port     :  3306,
          connectionLimit : 100,
          debug : false
        },
        redis: {
          host     : 'pub-redis-11098.us-east-1-2.5.ec2.garantiadata.com',
          password : 'k041k4',
          port     :  11098
        }
      },
      remote: {
        mySQL: {
          host     : 'odmetax.cg8y7qilgmmv.us-east-1.rds.amazonaws.com',
          password : 'C0reattack',
          user     : 'admin',
          database : 'odmetax',
          port     :  3306,
          connectionLimit : 100,
          debug : false
        },
        redis: {
          host     : 'pub-redis-11098.us-east-1-2.5.ec2.garantiadata.com',
          password : 'k041k4',
          port     :  11098
        }
      }
    }
  };

module.exports = {
  setupConfig : (function setupConfig() {
    var param;
    console.log('--------------------------------');
    console.log('Connecting to ' + chalk.green(parameters.activeEnvironment) + ' environment');
    console.log('--------------------------------');
    if (parameters.activeEnvironment === 'local') {
      param = parameters.environment.local;
      param.logToFile = parameters.logToFile;
      param.redisFlush = parameters.redisFlush;
      return param;
    } else {
      param = parameters.environment.remote;
      param.logToFile = parameters.logToFile;
      param.redisFlush = parameters.redisFlush;
      return param;
    }
  }),
  parameters: parameters
};
