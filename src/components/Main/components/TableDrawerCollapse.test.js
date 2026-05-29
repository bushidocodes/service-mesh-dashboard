import React from "react";
import { shallow } from "enzyme";
import TableDrawerCollapse from "./TableDrawerCollapse";

describe("TableDrawerCollapse", () => {
  it("matches snapshot", () => {
    const aTableDrawerCollapse = shallow(<TableDrawerCollapse />);
    expect(aTableDrawerCollapse).toMatchSnapshot();
  });
});
