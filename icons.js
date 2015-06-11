
var join = require('path').posix.join;
var read = require('fs').createReadStream;
var write = require('fs').createWriteStream;
var readSync = require('fs').readFileSync;
var writeSync = require('fs').writeFileSync;
var svgicons2svgfont = require('svgicons2svgfont');
var svg2ttf = require('svg2ttf');
var ttf2eot = require('ttf2eot');
var ttf2woff = require('ttf2woff');
var async = require('async');

module.exports = function(dir, targets) {
  return function(fn) {
    console.log('compiling icons...');
    async.mapSeries(targets.icon, convert, fn);
  };

  function convert(target, fn) {
    console.log('  ', target.dest, target.size);
    async.series({
      toSvgFont: toSvgFont(target),
      toFont: toFont(target),
      css: css(target)
    }, fn);
  }

  function toFont(target) {
    return function(fn) {
      var svg = readSync(join(dir, target.dest + '.svg'), 'utf8');
      var ttf = svg2ttf(svg, {});
      var eot = ttf2eot(ttf);
//      var woff = ttf2woff(ttf);
      writeSync(join(dir, target.dest + '.ttf'), new Buffer(ttf.buffer));
      writeSync(join(dir, target.dest + '.eot'), new Buffer(eot.buffer));
//      writeSync(join(dir, target.dest + '.woff'), new Buffer(woff.buffer));
      fn();
    };
  }

  function toSvgFont(target) {
    return function(fn) {
      var svgfont = svgicons2svgfont({
        fontName: target.dest,
        log: noop
      });

      var out = write(join(dir, target.dest + '.svg'));
      out.on('finish', fn);
      out.on('error', fn);

      svgfont.pipe(out);

      target.files.forEach(function(file, i) {
        var svg = read(file.src);
        svg.metadata = {
          unicode: [String.fromCharCode(0xe000 + i)],
          name: file.classes[0]
        };
        svgfont.write(svg);
      });

      svgfont.end();
    };
  }

  function css(target) {
    return function(fn) {
      var res = [
        '@font-face {',
        '  font-family: "' + target.dest + '--font";',
        '  src:',
        '    url("' + target.dest + '.ttf") format("truetype"),',
        '    url("' + target.dest + '.eot") format("embedded-opentype"),',
        '    url("' + target.dest + '.svg") format("svg");',
        ' }',
        '',
        '.' + target.dest + ' {',
        '  position: relative;',
        '  font-family: "' + target.dest + '--font";',
        '  font-size: ' + target.size + ';',
        '}'
      ];

      target.files.forEach(function(file, i) {
        var unicode = 0xe000 + i;
        res.push('');
        file.classes.forEach(function(className, x, arr) {
          res.push('.' + className + ':before' + (x < arr.length - 1 ? ',' : ' {'))
        });
        res.push('  content: "\\' + unicode.toString(16) + '"');
        res.push('}');
      });

      writeSync(join(dir, target.dest + '.css'), res.join('\n'), 'utf8');

      fn();
    };
  }
};

function noop() {/* noop */}
