var moment = require('moment');
var chalk = require('chalk');

module.exports = {
  log : function(txt, type = 's') {  // type: s = status , f = finished
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
