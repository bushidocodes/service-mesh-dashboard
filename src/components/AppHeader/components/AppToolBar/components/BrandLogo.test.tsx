import { render } from "@testing-library/react";
import BrandLogo from "./BrandLogo";

describe("BrandLogo", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<BrandLogo />);
    expect(asFragment()).toMatchSnapshot();
  });
});
