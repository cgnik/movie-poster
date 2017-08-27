global.chai = require('chai');
global.expect = global.chai.expect;
global.assert = global.chai.assert;
global.assertEqual = global.chai.assertEqual;
global.should = chai.should();
global.eventually = chai.eventually;
global.TIMEOUT = 100;
global.sinon = require('sinon');

var sinonChai = require("sinon-chai");
chai.use(require('chai-as-promised'));
chai.use(sinonChai);
chai.should();

global.MoviePoster = require('../src');
