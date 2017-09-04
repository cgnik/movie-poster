const Main = require('./main');
const cli = require('command-line-args');

let main = new Main(cli([
      {name: 'directory', multiple: true,  alias: 'd', type: String, defaultOption: true}
   ])
);
main.process();