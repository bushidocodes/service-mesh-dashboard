// Custom @testing-library/react wrapper that adds StyleSheetManager with
// shouldForwardProp to every render call. Restores styled-components v5
// behaviour: filter non-HTML props only for DOM elements; forward all props
// for custom React components (typeof target !== "string").
//
// Import via subpath so the moduleNameMapper regex (^@testing-library/react$)
// does NOT re-map this require back to itself.
const RTL = require("@testing-library/react/dist/index.js");
const React = require("react");
const { StyleSheetManager } = require("styled-components");
const isPropValid = require("@emotion/is-prop-valid").default;

function scShouldForwardProp(prop, target) {
  return typeof target === "string" ? isPropValid(prop) : true;
}

function render(ui, options) {
  if (options === undefined) options = {};
  const ExistingWrapper = options.wrapper;
  const newWrapper = ExistingWrapper
    ? function W({ children }) {
        return React.createElement(
          StyleSheetManager,
          { shouldForwardProp: scShouldForwardProp },
          React.createElement(ExistingWrapper, null, children)
        );
      }
    : function W({ children }) {
        return React.createElement(
          StyleSheetManager,
          { shouldForwardProp: scShouldForwardProp },
          children
        );
      };
  return RTL.render(ui, Object.assign({}, options, { wrapper: newWrapper }));
}

module.exports = Object.assign({}, RTL, { render });
