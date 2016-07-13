var moment = require('moment');
var chalk = require('chalk');

module.exports = {
  log : function(txt) {
    console.log(chalk.green(moment().format('MMMM Do YYYY, h:mm:ss a') + JSON.stringify(txt)));
  },
  logError : function(txt) {
    console.log(chalk.red('******'));
    console.error(chalk.red(moment().format('MMMM Do YYYY, h:mm:ss a') + JSON.stringify(txt)));
    console.log(chalk.red('******'));
  }
};
