// Vitest 5 types Assertion as <return type, received value>. jest-dom 7.0.1
// still augments the old one-parameter Assertion<T>, so that declaration does
// not merge and matchers such as toBeInTheDocument disappear from tsc.
// Matchers<R, T> is the extension point Assertion extends.
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "vitest" {
  interface Matchers<
    R extends void | Promise<void> = void | Promise<void>,
    T = unknown
  > extends TestingLibraryMatchers<unknown, R> {}
}
