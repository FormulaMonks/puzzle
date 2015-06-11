
var join = require('path').posix.join;
var retina = require('./util').retina;
var async = require('async');
var gm = require('gm');

module.exports = resize;

function resize(dir, targets) {
  return function(fn) {
    console.log('resizing images...');

    async.mapSeries(targets.image, function(target, fn) {
      console.log('  ', target.dest, target.size.join('x'));

      var dest = join(dir, target.dest);

      async.series({
        regular: function(fn) {
          imageResize(target.src, dest, target.size, fn);
        },
        retina: function(fn) {
          imageResize(target.src, retina(dest), retina(target.size), fn);
        }
      }, fn);
    }, fn);
  };
}

function imageResize(src, dest, size, fn) {
  gm(src)
  .noProfile()
  .gravity('Center')
  .background('transparent')
  .density(1200, 1200)
  .resize(size[0], size[1], '^')
  .extent(size[0], size[1])
  .write(dest, fn);
}
