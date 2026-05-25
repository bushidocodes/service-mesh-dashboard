import React from "react";
import { shallow } from "enzyme";
import mockState from "json/mockReduxState";
import configureStore from "redux-mock-store";

import ThreadCounts from "./ThreadCounts";

const mockStore = configureStore()(mockState);

const HelloWorld = (props) => <h1>Hello World!</h1>;

let ThreadCountsWrap;

describe("ThreadCounts Render Props component", () => {
  beforeEach(() => {
    ThreadCountsWrap = shallow(
      <ThreadCounts store={mockStore} render={HelloWorld} />
    );
  });

  test("renders via the function passed as the render prop", () => {
    expect(ThreadCountsWrap.html()).toEqual(shallow(<HelloWorld />).html());
  });

  test("passes a thread via the function passed as the render prop", () => {
    expect(ThreadCountsWrap.prop("threadCounts")).toEqual({
      active: 1,
      all: 6,
      idle: 2,
      stopped: 3
    });
  });
});
