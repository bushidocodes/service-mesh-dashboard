import { render } from "@testing-library/react";
import EditGraph from "./EditGraph";

describe("EditGraph", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <EditGraph />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
