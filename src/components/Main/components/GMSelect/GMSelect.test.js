import React from "react";
import { shallow } from "enzyme";
import GMSelect from "./GMSelect";

// A shallow render only captures the single <Select> element (react-select v5
// styles live in a CSS-in-JS `styles` object, not the global, randomly-suffixed
// classNames that made the old deep snapshot non-deterministic across CI), so
// the snapshot is now stable.
describe("GMSelect", () => {
  it("matches snapshot", () => {
    const aGMSelect = shallow(<GMSelect />);
    expect(aGMSelect).toMatchSnapshot();
  });
});
