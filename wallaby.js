module.exports = (wallaby) =>
{
  // There is a weird error with the mui and mantra.
  // See: https://goo.gl/cLH8ib
  // Using require here seems to be the error.
  // Renaming it into `load` just fixed the issue.
  var load = require;

  return {
    files: [
      'src/*.js',
      '.scripts/css-null-compiler.js',
      '.scripts/mocha_boot.js'
    ],
    tests: [
      'tests/*.js'
    ],
    compilers: {
      '**/*.js*': wallaby.compilers.babel({
        babel: load('babel-core'),
        // babelrc: true,
        presets: ['es2015', 'stage-2', 'react']
      })
    },
    env: {
      type: 'node'
    },
    testFramework: 'mocha',
    setup()
    {
      require('./.scripts/css-null-compiler');
      require('./.scripts/mocha_boot');
      const jsdom = require('jsdom').jsdom;
      global.document = jsdom('<!doctype html><html><body></body></html>');
      global.window = global.document.defaultView;
      global.navigator = global.window.navigator;
      global.React = require('react');
    }
  };
};
