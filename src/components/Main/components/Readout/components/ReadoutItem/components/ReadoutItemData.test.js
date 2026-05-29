import React from "react";
import { shallow } from "enzyme";
import ReadoutItemData from "./ReadoutItemData";

describe("ReadoutItemData", () => {
  it("matches snapshot", () => {
    const aReadoutItemData = shallow(<ReadoutItemData />);
    expect(aReadoutItemData).toMatchSnapshot();
  });
  it("allows padding-left of first-child to be overridden", () => {
    const aReadoutItemData = shallow(<ReadoutItemData paddingLeft="99px" />);
    // The override applies to padding-left under the :first-child selector;
    // jest-styled-components targets nested rules via the `modifier` option.
    expect(aReadoutItemData).toHaveStyleRule("padding-left", "99px", {
      modifier: ":first-child"
    });
  });
});
