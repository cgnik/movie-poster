global.chai = require('chai');
global.expect = global.chai.expect;
global.assert = global.chai.assert;
global.assertEqual = global.chai.assertEqual;
global.should = chai.should();
global.TIMEOUT = 100;
global.sinon = require('sinon');
global.rewire = require('rewire');

var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

require('../src/globals.js');

global.log.level = log.level.debug;
