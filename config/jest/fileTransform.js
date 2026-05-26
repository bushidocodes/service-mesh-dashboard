"use strict";

const path = require("path");

// This is a custom Jest transformer turning file imports into filenames.
// http://facebook.github.io/jest/docs/tutorial-webpack.html

module.exports = {
  // Jest 27+ requires transformers to return { code } instead of a string.
  process(src, filename) {
    return {
      code: `module.exports = ${JSON.stringify(path.basename(filename))};`
    };
  }
};
