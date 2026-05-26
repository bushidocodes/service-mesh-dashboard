import React from "react";
import { mount, shallow } from "enzyme";
import Breadcrumbs from "./Breadcrumbs";
import Breadcrumb from "./Breadcrumb";
import { Link } from "react-router-dom";
import { MemoryRouter } from "react-router";

describe("Breadcrumbs", () => {
  it("matches snapshot when showing root", () => {
    const aBreadcrumbs = shallow(<Breadcrumbs />);
    expect(aBreadcrumbs).toMatchSnapshot();
  });
  it("matches snapshot when hiding root", () => {
    const aBreadcrumbs = shallow(<Breadcrumbs hideRoot />);
    expect(aBreadcrumbs).toMatchSnapshot();
  });
  // The jest-styled-components repo is really unclear about how to
  // test the rules we apply to the `> li:first-child` child selector
  // via Breadcrumbs. This should be revisited later when the documentation
  // or functionality might have been enhanced
  xit("hides the first child when passed the hideRoot prop ", () => {
    const aBreadcrumbs = mount(
      <MemoryRouter>
        <Breadcrumbs hideRoot>
          <Breadcrumb>
            <Link to="/">Fabric</Link>
          </Breadcrumb>
        </Breadcrumbs>
      </MemoryRouter>
    );

    const firstBreadcrumb = aBreadcrumbs.find("li");
    expect(firstBreadcrumb).toHaveStyleRule("position", "absolute");
    expect(firstBreadcrumb).toHaveStyleRule("visibility", "hidden");
    expect(firstBreadcrumb).toHaveStyleRule("pointer-events", "none");
  });
});
