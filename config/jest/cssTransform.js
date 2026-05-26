"use strict";

// This is a custom Jest transformer turning style imports into empty objects.
// http://facebook.github.io/jest/docs/tutorial-webpack.html

module.exports = {
  // Jest 27+ requires transformers to return { code } instead of a string.
  process() {
    return { code: "module.exports = {};" };
  },
  getCacheKey() {
    // The output is always the same.
    return "cssTransform";
  }
};
