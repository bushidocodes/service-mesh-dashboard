import { render } from "@testing-library/react";

import { Loading } from "./Loading";

describe("Loading", () => {
  test("renders nothing initially when delay > 0", () => {
    // NOTE: Spinner is a styled.div with no role/text/testid, so we assert on
    // the observable DOM: with delay > 0 Loading returns null, so the container
    // renders no element children (the Spinner div is absent).
    const { container } = render(<Loading delay={250} />);
    expect(container.querySelectorAll("div")).toHaveLength(0);
    expect(container.firstChild).toBeNull();
  });

  test("renders <Spinner /> immediately when delay=0", () => {
    // NOTE: with delay=0 Loading renders the Spinner styled.div synchronously,
    // observed as a single div element in the container.
    const { container } = render(<Loading delay={0} />);
    expect(container.querySelectorAll("div")).toHaveLength(1);
    expect(container.firstChild).not.toBeNull();
  });
});
