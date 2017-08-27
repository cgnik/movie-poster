global.chai = require('chai');
global.expect = global.chai.expect;
global.assert = global.chai.assert;
global.assertEqual = global.chai.assertEqual;
global.should = chai.should();
global.TIMEOUT = 100;
global.sinon = require('sinon');

var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

global.MoviePoster = require('../src');
