import React from "react";
import { shallow } from "enzyme";
import GMTable from "./GMTable";

let wrapper;
const props = {
  title: "Requests",
  headers: ["Requests", "Success"],
  rows: [
    ["http", 0, 0],
    ["https", 1743, 4324]
  ]
};
describe("<GMTable> stateless child component of GMGrid", () => {
  beforeEach(() => {
    wrapper = shallow(<GMTable {...props} />);
  });

  test("matches snapshot", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
