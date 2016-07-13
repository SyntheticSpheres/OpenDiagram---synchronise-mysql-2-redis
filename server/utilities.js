var moment = require('moment');
var chalk = require('chalk');
var config = require('./configuration.js');
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream('./log/debug.log', {flags : 'w'});
var log_stdout = process.stdout;



module.exports = {
  log : function(txt, type = 's') {  // type: s = status , f = finished
    if(config.logToFile) {
      console.log = function(txt) { //
        log_file.write(util.format(txt) + '\n');
        log_stdout.write(util.format(txt) + '\n');
      };
    }
    switch (type) {
      case 's':
        console.log(chalk.green(moment().format('MMMM Do YYYY, h:mm:ss a') + JSON.stringify(txt)));
        break;
      case 'f':
        console.log(chalk.blue(moment().format('MMMM Do YYYY, h:mm:ss a') + JSON.stringify(txt)));
        break;
    }
  },
  logError : function(txt) {
    console.log(chalk.red('******'));
    console.error(chalk.red(moment().format('MMMM Do YYYY, h:mm:ss a') + JSON.stringify(txt)));
    console.log(chalk.red('******'));
  }
};
