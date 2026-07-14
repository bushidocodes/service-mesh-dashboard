// Snapshot CSS serializer for styled-components (injects computed rules into
// snapshots). Kept for snapshot stability; style assertions should prefer
// @testing-library/jest-dom's toHaveStyle over toHaveStyleRule.
import "jest-styled-components";

// Adds custom DOM matchers (toBeInTheDocument, toHaveTextContent, toHaveStyle,
// toHaveAttribute, etc.) used by the React Testing Library suites.
import "@testing-library/jest-dom";
