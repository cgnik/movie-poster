const Main = require('./main');
const cli = require('command-line-args');

let main = new Main(cli([
      {name: 'ui', alias: 'v', type: Boolean},
      {name: 'src', type: String, multiple: true, defaultOption: true},
      {name: 'timeout', alias: 't', type: Number}
   ])
);
main.process();