// Import the jest-styled-components library to inject the style rules into the snapshots for styled-components
import "jest-styled-components";

// Adds custom DOM matchers (toBeInTheDocument, toHaveTextContent, toHaveStyleRule
// interop, toHaveAttribute, etc.) used by the React Testing Library suites.
import "@testing-library/jest-dom";
