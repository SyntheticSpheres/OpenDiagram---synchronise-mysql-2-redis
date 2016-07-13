var chalk = require('chalk');

var parameters =
  { activeEnvironment : 'local',  // "local" or "remote"
    logToFile : false, // true or false
    environment: {
      local: {
        mySQL: {
          host     : '127.0.0.1',
          password : 'C0reattack',
          user     : 'admin',
          database : 'odMetaX',
          port     :  3306
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
          database : 'odMetaX',
          port     :  3306
        },
        redis: {
          host     : 'pub-redis-11098.us-east-1-2.5.ec2.garantiadata.com',
          password : 'k041k4',
          port     :  11098
        }
      }
    }
  };

  function setupConfig() {
    var param;
    console.log('--------------------------------');
    console.log('Connecting to ' + chalk.green(parameters.activeEnvironment) + ' environment');
    console.log('--------------------------------');
    if (parameters.activeEnvironment === 'local') {
      param = parameters.environment.local;
      param.logToFile = parameters.logToFile;
      return param;
    } else {
      param = parameters.environment.remote;
      param.logToFile = parameters.logToFile;
      return param;
    }
  }

module.exports = setupConfig();
