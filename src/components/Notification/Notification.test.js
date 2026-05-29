import React from "react";
import { mount } from "enzyme";
import { ToastContainer } from "react-toastify";

import Notification from "./index";

describe("Notification", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Notification />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test("renders a react-toastify <ToastContainer />", () => {
    expect(wrapper.find(ToastContainer)).toHaveLength(1);
  });
});
