// Stub out different index.html configurations containing different meta tag combinations
// const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`)

// TODO: Mock out a state object for the Reselect selectors

// Note: You'll need to refactor generateSidebarCards to make this easier to test
// The goal should be to refactor out an intermediate selector
// that produces an array of props objects, but doesn't actually pass them into
// <SidebarCard>

import { getFabricServer } from "./head";

const documentHead = `
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Grey Matter Fabric</title>
`;

describe("getFabricServer", () => {
  test("returns the value of the fabricServer meta tag when not equal to __FABRIC_SERVER__", () => {
    document.head.innerHTML =
      documentHead +
      `<meta property="fabricServer" content="http://localhost:1337">`;
    expect(getFabricServer()).toEqual("http://localhost:1337");
  });

  test("returns null when the fabricServer meta tag is equal to __FABRIC_SERVER__", () => {
    document.head.innerHTML =
      documentHead +
      `<meta property="fabricServer" content="__FABRIC_SERVER__">`;
    expect(getFabricServer()).toEqual(null);
  });
});
