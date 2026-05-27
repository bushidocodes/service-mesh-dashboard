import React from "react";
import { mount } from "enzyme";

import { Loading } from "./Loading";
import Spinner from "./components/Spinner";

describe("Loading", () => {
  test("renders nothing initially when delay > 0", () => {
    const wrapper = mount(<Loading delay={250} />);
    expect(wrapper.find(Spinner)).toHaveLength(0);
  });

  test("renders <Spinner /> immediately when delay=0", () => {
    const wrapper = mount(<Loading delay={0} />);
    expect(wrapper.find(Spinner)).toHaveLength(1);
  });
});
