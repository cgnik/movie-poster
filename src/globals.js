global.merge = require('merge')
global.fs = require('fs');
global.path = require('path');
global.http = require('http');
global.fuzzy = require('fuzzy');
global._ = module.require('underscore');
global.log = require('./movie-log.js');
global.log.level = log.levels.debug;