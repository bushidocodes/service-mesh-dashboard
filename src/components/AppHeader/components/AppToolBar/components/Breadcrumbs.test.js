import React from "react";
import { shallow } from "enzyme";
import Breadcrumbs from "./Breadcrumbs";

describe("Breadcrumbs", () => {
  it("matches snapshot when showing root", () => {
    const aBreadcrumbs = shallow(<Breadcrumbs />);
    expect(aBreadcrumbs).toMatchSnapshot();
  });
  it("matches snapshot when hiding root", () => {
    const aBreadcrumbs = shallow(<Breadcrumbs hideRoot />);
    expect(aBreadcrumbs).toMatchSnapshot();
  });
  // The hideRoot styling is applied via the `> li:first-child` child selector.
  // jest-styled-components can assert on nested selectors through the `modifier`
  // option, so we no longer need to mount real <Breadcrumb> children.
  it("hides the first child when passed the hideRoot prop", () => {
    const aBreadcrumbs = shallow(<Breadcrumbs hideRoot />);
    const modifier = { modifier: "> li:first-child" };
    expect(aBreadcrumbs).toHaveStyleRule("position", "absolute", modifier);
    expect(aBreadcrumbs).toHaveStyleRule("visibility", "hidden", modifier);
    expect(aBreadcrumbs).toHaveStyleRule("pointer-events", "none", modifier);
  });

  it("does not hide the first child without the hideRoot prop", () => {
    const aBreadcrumbs = shallow(<Breadcrumbs />);
    expect(aBreadcrumbs).not.toHaveStyleRule("visibility", "hidden", {
      modifier: "> li:first-child"
    });
  });
});
