import { render } from "@testing-library/react";
import GMSelectValueRenderer from "./GMSelectValueRenderer";

describe("GMSelectValueRenderer", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <GMSelectValueRenderer title="Yo" val={{ label: "Yo label" }} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
