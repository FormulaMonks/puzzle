
var type = require('component-type');

exports.bem = bem;
exports.slug = slug;
exports.getSize = getSize;
exports.stripExt = stripExt;
exports.getExt = getExt;
exports.retina = retina;

function bem() {
  var s = '';

  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if ('array' === type(arg)) {
      if (arg.length) s += '--' + arg.join('--');
    } else {
      s = s
        ? s + '__' + slug(arg)
        : arg;
    }
  }

  return s;
}

function slug(arg) {
  return arg.replace(/\//g, '-');
}

function getSize(s) {
  return s.split(' ')[0].split('x');
}

function stripExt(s) {
  return s.split('.')[0];
}

function getExt(s) {
  return s.split(' ')[1] || s.split('.')[1];
}

function retina(s) {
  if ('string' === type(s)) return stripExt(s) + '@2x.' + getExt(s);
  else return s.map(function(x) { return x * 2 });
}
