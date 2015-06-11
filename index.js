
var mkdirp = require('mkdirp').sync;
var yaml = require('js-yaml').safeLoad;
var join = require('path').posix.join;
var read = require('fs').readFileSync;
var async = require('async');

var parse = require('./parse');
var normalize = require('./normalize');
var resize = require('./resize');
var sprites = require('./sprites');
var icons = require('./icons');

exports = module.exports = run;
exports.run = run;
exports.load = load;
exports.parse = parse;
exports.normalize = normalize;

function run(src, dest, fn) {
  mkdirp(dest);

  var targets = normalize(load(src), src);

  async.series({
    resize: resize(dest, targets),
    sprites: sprites(dest, targets),
    icons: icons(dest, targets)
  }, fn);
}

function load(path) {
  var input = yaml(read(join(path, 'assets.yml'), 'utf8'));
  var targets = parse(input);
  return targets;
}
