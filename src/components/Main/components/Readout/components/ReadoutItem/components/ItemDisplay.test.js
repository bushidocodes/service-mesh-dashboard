import React from "react";
import { shallow } from "enzyme";
import ItemDisplay from "./ItemDisplay";

describe("ItemDisplay", () => {
  it("matches snapshot", () => {
    const aItemDisplay = shallow(<ItemDisplay />);
    expect(aItemDisplay).toMatchSnapshot();
  });
  it("allows flex value to be overridden", () => {
    // Different flex props should produce different styled-components class names,
    // confirming the prop is wired into the CSS template.
    const defaultFlex = shallow(<ItemDisplay />);
    const customFlex = shallow(<ItemDisplay flex="0 1 33%" />);
    expect(defaultFlex.prop("className")).not.toBe(
      customFlex.prop("className")
    );
  });
});
