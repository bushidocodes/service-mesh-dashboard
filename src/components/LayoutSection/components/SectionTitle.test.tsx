import { render } from "@testing-library/react";
import SectionTitle from "./SectionTitle";

describe("SectionTitle", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<SectionTitle />);
    expect(asFragment()).toMatchSnapshot();
  });
});
