import React from "react";
import { shallow } from "enzyme";

import { Loading } from "./Loading";
import Spinner from "./components/Spinner";
import Message from "./components/Message";

describe("Loading", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <Loading error={false} timedOut={false} pastDelay={true} />
    );
  });

  // TODO(jest-upgrade): enzyme.find(StyledComponent) throws "Enzyme::Props can't
  // have undefined values" with styled-components v5 + enzyme-react-18.
  // Skip until an Enzyme→RTL migration PR replaces find(SC) with findWhere().
  xtest("returns a <Spinner/> if pastDelay is true", () => {
    expect(wrapper.find(Spinner)).toHaveLength(1);
    // does not return error messages
    expect(wrapper.find(Message)).toHaveLength(0);
    expect(
      wrapper.html().includes("An error occurred while loading this component.")
    ).toBe(false);
    expect(
      wrapper
        .html()
        .includes(
          "This component failed to load within the allotted 15 seconds."
        )
    ).toBe(false);
  });

  // TODO(jest-upgrade): enzyme.find(StyledComponent) throws with SC v5 + enzyme-react-18.
  xtest("returns an error message if error is true", () => {
    wrapper.setProps({ error: true });
    expect(wrapper.find(Message)).toHaveLength(1);
    expect(
      wrapper.html().includes("An error occurred while loading this component.")
    ).toBe(true);
    expect(wrapper.find(Spinner)).toHaveLength(0);
  });

  // TODO(jest-upgrade): enzyme.find(StyledComponent) throws with SC v5 + enzyme-react-18.
  xtest("returns a message if timedOut is true", () => {
    wrapper.setProps({ error: false, timedOut: true });
    expect(wrapper.find(Message)).toHaveLength(1);
    expect(
      wrapper
        .html()
        .includes(
          "This component failed to load within the allotted 15 seconds."
        )
    ).toBe(true);
    expect(wrapper.find(Spinner)).toHaveLength(0);
  });
});
