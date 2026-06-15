import React from "react";
import { render } from "@testing-library/react";
import GMTable from "./GMTable";

let asFragment: () => DocumentFragment;
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
    ({ asFragment } = render(<GMTable {...props} />));
  });

  test("matches snapshot", () => {
    expect(asFragment()).toMatchSnapshot();
  });
});
