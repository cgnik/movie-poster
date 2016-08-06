require('./globals.js');
Main = require('./main.js');

main = new Main();
main.initProcessArgs(process.argv);
process.on('exit', function (){
    main.finish();
});
