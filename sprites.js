
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

      var filename = target.dest + '.' + target.format;

      var options = {
        src: target.files.map(function(s) { return join(dir, retina(s)) }),
        engine: 'gmsmith',
        exportOpts: {
          format: target.format
        }
      };

      spritesmith(options, function(err, res) {
        if (err) return fn(err);

        write(join(dir, retina(filename)), res.image, 'binary');

        var options = {
          src: target.files.map(function(s) { return join(dir, s) }),
          engine: 'gmsmith',
          exportOpts: {
            format: target.format
          }
        };

        spritesmith(options, function(err, res) {
          if (err) return fn(err);

          write(join(dir, filename), res.image, 'binary');

          var style = [
            css(target.dest, filename, res.properties),
            Object.keys(res.coordinates).map(function(name) {
              var coords = res.coordinates[name];
              var className = name.substr(name.lastIndexOf('/') + 1).split('.')[0];
              return cssRule(className, coords);
            }).join('\n')
          ].join('\n');

          write(join(dir, target.dest + '.css'), style, 'utf8');

          fn();
        });
      });
    }, fn);
  };
}

function css(className, url, properties) {
  return [
    '.' + className + ' {',
    '  background-image: url(' + url + ');',
    '}',
    '',
    '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {',
    '  .' + className + ' {',
    '    background-image: url(' + retina(url) + ');',
    '    background-size: ' + properties.width + 'px ' + properties.height + 'px;',
    '  }',
    '}'
  ].join('\n');
}

function cssRule(className, coords) {
  return [
    '.' + className + ' {',
    '  background-position: -' + coords.x + 'px -' + coords.y + 'px;',
    '  width: ' + coords.width + 'px;',
    '  height: ' + coords.height + 'px;',
    '}'
  ].join('\n');
}
