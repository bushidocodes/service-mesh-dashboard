import React from "react";
import { render } from "@testing-library/react";

import Tooltip from "./Tooltip";

function renderTooltip(position) {
  return render(
    <Tooltip content="Hello!" position={position}>
      Hover over me
    </Tooltip>
  );
}

describe("Tooltip", () => {
  let wrapper = renderTooltip("top");

  it("correctly positions tooltip content based on position prop", () => {
    expect(wrapper.asFragment()).toMatchSnapshot();
    wrapper = renderTooltip("bottom");
    expect(wrapper.asFragment()).toMatchSnapshot();
    wrapper = renderTooltip("left");
    expect(wrapper.asFragment()).toMatchSnapshot();
    wrapper = renderTooltip("right");
    expect(wrapper.asFragment()).toMatchSnapshot();
  });

  it("renders a tooltip div with the correct content", () => {
    const { container } = renderTooltip("bottom");
    expect(container).toHaveTextContent("Hello!");
  });
});
