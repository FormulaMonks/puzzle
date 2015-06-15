
var join = require('path').posix.join;
var write = require('fs').writeFileSync;
var async = require('async');
var retina = require('./util').retina;
var spritesmith = require('spritesmith');

module.exports = sprites;

function sprites(dir, targets) {
  return function(fn) {
    console.log('generating sprites...');

    async.mapSeries(targets.sprite, function(target, fn) {
      console.log('  ', target.dest);

      var style = [];

      async.series({
        regular: writeSprites(style, target, false),
        retina: writeSprites(style, target, true),
        css: writeCss(style, target)
      }, fn);
    }, fn);
  };

  function writeCss(style, target) {
    return function(fn) {
      write(join(dir, target.dest + '.css'), style.join('\n'), 'utf8');
      fn();
    };
  }

  function writeSprites(style, target, isRetina) {
    return function(fn) {
      var options = {
        src: target.files.map(function(s) { return join(dir, isRetina ? retina(s) : s) }),
        padding: 2,
        exportOpts: {
          format: target.format
        }
      };

      var filename = target.dest + '.' + target.format;
      filename = isRetina ? retina(filename) : filename;

      spritesmith(options, function(err, res) {
        if (err) return fn(err);

        write(join(dir, filename), res.image, 'binary');

        var rules = css(target.dest, filename, res, isRetina);

        style.push(isRetina ? media(rules) : rules);

        fn();
      });
    };
  }
}

function media(style) {
  return [
    '@media',
    '  only screen and (-webkit-min-device-pixel-ratio: 1.3),',
    '  only screen and (   min--moz-device-pixel-ratio: 1.3),',
    '  only screen and (     -o-min-device-pixel-ratio: 1.3),',
    '  only screen and (        min-device-pixel-ratio: 1.3),',
    '  only screen and (                min-resolution: 124dpi),',
    '  only screen and (                min-resolution: 1.3dppx) {',
    style,
    '}',
  ].join('\n');
}

function css(className, url, res, isRetina) {
  return [
    '.' + className + ' {',
    '  background-image: url(' + url + ');',
    '  background-size: '
    + (res.properties.width / (isRetina ? 2 : 1)) + 'px '
    + (res.properties.height / (isRetina ? 2 : 1)) + 'px;',
    '}',
    Object.keys(res.coordinates).map(function(name) {
      var coords = res.coordinates[name];
      var className = name.substr(name.lastIndexOf('/') + 1).split('.')[0].split('@')[0];
      return cssRule(className, coords, isRetina);
    }).join('\n')
  ].join('\n');
}

function cssRule(className, coords, isRetina) {
  return [
    '.' + className + ' {',
    '  background-position: -'
    + (coords.x / (isRetina ? 2 : 1)) + 'px -'
    + (coords.y / (isRetina ? 2 : 1)) + 'px;',
    '  width: ' + (coords.width / (isRetina ? 2 : 1)) + 'px;',
    '  height: ' + (coords.height / (isRetina ? 2 : 1)) + 'px;',
    '}'
  ].join('\n');
}
