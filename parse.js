
var type = require('component-type');

module.exports = parse;

function parse(input) {
  var targets = [];
  for (var key in input) {
    var tokens = key.split(' ');
    var method = tokens[0];
    var args = tokens.slice(1).concat([input[key]]);
    var res = parse[method].apply(null, args);
    targets = targets.concat(res);
  }
  return targets;
}

parse.image = function(name, path, size, modifier) {
  var targets = [];
  var res = {};

  res.type = 'image';
  res.name = name;
  res.path = path;
  res.size = size;

  if (modifier) res.modifier = modifier;

  if ('object' === type(size)) {
    for (var key in size) {
      targets.push(parse.image(name, path, size[key], key)[0]);
    }
  } else {
    targets.push(res);
  }

  return targets;
};

parse.icon = function(name, path, size, aliases) {
  var res = {};
  res.type = 'icon';
  res.name = name;
  res.path = path;
  res.size = size;
  res.aliases = aliases || {};
  return [res];
};

parse.sprite = function(name, path, size, files) {
  var res = {};

  res.type = 'sprite';
  res.name = name;
  res.path = path;
  res.files = [];

  if (!files) {
    files = size;
    for (var file in files) {
      size = files[file];
      push(size)(file);
    }
  } else {
    files.forEach(push(size));
  }

  return [res];

  function push(size) {
    return function(file) {
      res.files.push({
        file: file,
        size: size
      });
    }
  }
};
