Main = require('./main.js');

main = new Main();
main.initProcessArgs(process.argv);
main.process();
