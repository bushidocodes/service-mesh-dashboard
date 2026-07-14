import { render } from "@testing-library/react";
import InspectorSearch from "./InspectorSearch";

describe("InspectorSearch", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<InspectorSearch />);
    expect(asFragment()).toMatchSnapshot();
  });
});
