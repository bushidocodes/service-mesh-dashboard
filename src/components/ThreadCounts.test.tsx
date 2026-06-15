import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import mockState from "json/mockReduxState";
import configureStore from "redux-mock-store";

import ThreadCounts from "./ThreadCounts";

const mockStore = configureStore()(mockState);

const HelloWorld = (props: any) => <h1>Hello World!</h1>;

describe("ThreadCounts Render Props component", () => {
  test("renders via the function passed as the render prop", () => {
    render(
      <Provider store={mockStore}>
        <ThreadCounts render={HelloWorld} />
      </Provider>
    );
    expect(screen.getByRole("heading", { level: 1 }).outerHTML).toEqual(
      "<h1>Hello World!</h1>"
    );
  });

  test("passes a thread via the function passed as the render prop", () => {
    let capturedCounts;
    const captureRender = (counts: any) => {
      capturedCounts = counts;
      return <h1>Hello World!</h1>;
    };
    render(
      <Provider store={mockStore}>
        <ThreadCounts render={captureRender} />
      </Provider>
    );
    expect(capturedCounts).toEqual({
      active: 1,
      all: 6,
      idle: 2,
      stopped: 3
    });
  });
});
