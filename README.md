
# puzzle

A simple assets compiler.

Takes high-dpi source images and vectors and compiles to Retina and low-dpi images, CSS sprites and icon fonts. It is designed to be *designer-friendly* and *developer-ready*.

![Puzzle](http://cl.ly/c33a/puzzle_logo2.png)

## Usage

#### Command line:

`$ refrax <src> <dest>`

#### Node.js:

```js
var refrax = require('refrax');

refrax(src, dest, function(err) {
  if (err) throw err;
  console.log('all done, no errors');
});
```

`src` is the source directory, containing an `assets.yml` directive file.

`dest` is the destination directory. If it doesn't exist, it will be created for you. All resulting files will be placed there.

## Syntax

```yml
# images

image <dest>[.format] <src>: <width>x<height> [format]

image <dest> <src>:
  <alt-1>: <width>x<height> [format]
  <alt-2>: <width>x<height> [format]
  ...

# sprites

sprite <dest>[.format] <src-dir>:
  <src>: <width>x<height>
  <src>: <width>x<height>
  ...

sprite <dest>[.format] <src-dir> <width>x<height>:
  - <src>
  - <src>
  ...

# icon fonts

icon <dest> <src-dir> <size>:
  [<src>: <alias> [alias] [...]]

```

See [here](test/fixture/assets.yml) for an example `assets.yml`.

## API

#### refrax(src, dest, fn)

## Notes

Use filenames in `slug-case`; latin alphabet lowercase letters, numbers and dashes are considered safe. No spaces.

## License

This library is provided under the MIT license. See [LICENSE](LICENSE) for applicable terms.


## About Citrusbyte

![Citrusbyte](http://i.imgur.com/W6eISI3.png)

Puzzle is lovingly maintained and funded by Citrusbyte.
At Citrusbyte, we specialize in solving difficult computer science problems for startups and the enterprise.

At Citrusbyte we believe in and support open source software.
* Check out more of our open source software at Citrusbyte Labs.
* Learn more about [our work](https://citrusbyte.com/portfolio).
* [Hire us](https://citrusbyte.com/contact) to work on your project.
* [Want to join the team?](http://careers.citrusbyte.com)

*Citrusbyte and the Citrusbyte logo are trademarks or registered trademarks of Citrusbyte, LLC.*
