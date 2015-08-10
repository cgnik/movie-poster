global.chai = require('chai');
global.expect = global.chai.expect;
global.assert = global.chai.assert;
global.assertEqual = global.chai.assertEqual;
global.should = chai.should();
global.TIMEOUT = 200;
global.sinon = require('sinon');

global.log = require('../../src/movie-log.js');
global.log.level = 'debug';
