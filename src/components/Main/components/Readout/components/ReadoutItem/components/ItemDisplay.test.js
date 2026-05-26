import React from "react";
import { shallow } from "enzyme";
import ItemDisplay from "./ItemDisplay";

describe("ItemDisplay", () => {
  it("matches snapshot", () => {
    const aItemDisplay = shallow(<ItemDisplay />);
    expect(aItemDisplay).toMatchSnapshot();
  });
  // TODO(jest-upgrade): toHaveStyleRule from jest-styled-components fails on SC v5
  // shallow wrappers with enzyme-react-18 (styled-component is memo/forwardRef
  // and shallow renders the wrapper layer, not the DOM node with the style rule).
  // Skip until an Enzyme→RTL migration PR rewrites this test.
  xit("allows flex value to be overridden", () => {
    const aItemDisplay = shallow(<ItemDisplay flex="0 1 33%" />);
    expect(aItemDisplay).toHaveStyleRule("flex", "0 1 33%");
  });
});
