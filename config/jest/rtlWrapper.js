// Custom @testing-library/react wrapper that adds StyleSheetManager with
// shouldForwardProp to every render call. Restores styled-components v5
// behaviour: filter non-HTML props only for DOM elements; forward all props
// for custom React components (typeof target !== "string").
//
// ESM (not CJS): importing styled-components via `import` here resolves to the
// SAME module instance the components under test use, so jest-styled-components'
// toHaveStyleRule reads the populated stylesheet. A CJS `require` pulled in a
// second styled-components build with its own (empty) sheet, which broke the
// matcher under Vitest.
//
// Import @testing-library/react via its /dist/ subpath so the Vitest alias
// (exact-match /^@testing-library\/react$/) does NOT remap this back to itself.
import * as RTL from "@testing-library/react/dist/index.js";
import React from "react";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";

function scShouldForwardProp(prop, target) {
  return typeof target === "string" ? isPropValid(prop) : true;
}

// Re-export everything (screen, fireEvent, waitFor, within, …). The explicit
// `render` below shadows RTL's star-exported render per the ES module spec.
export * from "@testing-library/react/dist/index.js";

export function render(ui, options = {}) {
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
  return RTL.render(ui, { ...options, wrapper: newWrapper });
}
