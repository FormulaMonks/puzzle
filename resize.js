
var join = require('path').posix.join;
var exists = require('fs').existsSync;
var retina = require('./util').retina;
var async = require('async');
var gm = require('gm');
var cp = require('cp');

module.exports = resize;

function resize(dir, targets) {
  return function(fn) {
    console.log('resizing images...');

    async.mapSeries(targets.image, function(target, fn) {
      console.log('  ', target.dest, target.size.join('x'));

      var dest = join(dir, target.dest);

      async.series({
        regular: function(fn) {
          imageResize(target.src, dest, target.size, false, fn);
        },
        retina: function(fn) {
          imageResize(target.src, dest, target.size, true, fn);
        }
      }, fn);
    }, fn);
  };
}

function imageResize(src, dest, size, toRetina, fn) {
  if ('no-resize' === size[0]) {
    return copy(src, dest, toRetina, fn);
  }

  if (toRetina) {
    dest = retina(dest);
    size = retina(size);
  }

  gm(src)
  .noProfile()
  .gravity('Center')
  .background('transparent')
  .density(1200, 1200)
  .resize(size[0], size[1], '^')
  .extent(size[0], size[1])
  .write(dest, fn);
}

function copy(src, dest, toRetina, fn) {
  var hasRetina = exists(retina(src));

  if (toRetina) {
    dest = retina(dest);

    if (hasRetina) {
      src = retina(src);
    }

    cp(src, dest, fn);
  } else {
    if (hasRetina) {
      cp(src, dest, fn);
    } else {
      gm(src)
      .noProfile()
      .gravity('Center')
      .background('transparent')
      .density(1200, 1200)
      .resize(50, 50, '%')
      .write(dest, fn);
    }
  }
}
