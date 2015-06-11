
var assets = require('..');
var inspect = require('util').inspect;

var src = __dirname + '/fixture';
var dest = __dirname + '/build';

assets.run(src, dest, function(err) {
  if (err) throw err;
  console.log('all done, no errors');
});
