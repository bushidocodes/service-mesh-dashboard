import { render } from "@testing-library/react";
import Person from "./Person";

describe("Person", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Person />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
