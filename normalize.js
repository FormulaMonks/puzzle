
var type = require('component-type');
var join = require('path').posix.join;
var resolve = require('path').resolve;
var readdir = require('fs').readdirSync;
var bem = require('./util').bem;
var getSize = require('./util').getSize;
var getExt = require('./util').getExt;
var stripExt = require('./util').stripExt;

module.exports = normalize;

function normalize(targets, dirname) {
  var n = {
    sprite: [],
    image: [],
    icon: []
  };

  targets.forEach(function(target) {
    switch (target.type) {
      case 'image':
        var res = {};
        res.src = resolve(join(dirname, target.path));
        res.dest = bem(
          target.type,
          stripExt(target.name),
          [target.modifier].filter(Boolean)
        ) + '.' + (getExt(target.size) || getExt(target.name) || getExt(target.path));
        res.size = getSize(target.size);
        n.image.push(res);
        break;

      case 'sprite':
        var sprite = {
          dest: bem('sprite', stripExt(target.name)),
          format: getExt(target.name) || 'png',
          files: [],
        };
        n.sprite.push(sprite);
        target.files.forEach(function(file) {
          var res = {};
          res.src = resolve(join(dirname, target.path, file.file));
          res.dest = bem(
            target.type,
            stripExt(target.name),
            [stripExt(file.file)]
          ) + '.png';
          res.size = getSize(file.size);
          n.image.push(res);
          sprite.files.push(res.dest);
        });
        break;

      case 'icon':
        var icon = {
          dest: bem('icon', target.name),
          size: target.size,
          files: []
        };
        n.icon.push(icon);
        var files = readdir(join(dirname, target.path));
        files.forEach(function(file) {
          var res = {};
          res.src = resolve(join(dirname, target.path, file));
          res.classes = [bem(
            target.type,
            target.name,
            [stripExt(file)]
          )];
          var aliases = target.aliases[stripExt(file)] || '';

          aliases
          .split(' ')
          .filter(Boolean)
          .forEach(function(alias) {
            res.classes.push(bem(
              target.type,
              target.name,
              [alias]
            ));
          });

          icon.files.push(res);
        });
        break;
    }
  });

  return n;
}
