import { render } from "@testing-library/react";

import Notification from "./index";

describe("Notification", () => {
  test("renders a react-toastify <ToastContainer />", () => {
    // NOTE: enzyme's .find(ToastContainer) matched by component type, which RTL
    // cannot do. react-toastify v11 always renders its container as a
    // <section class="Toastify" aria-live="polite"> wrapper (the per-position
    // toast <div>s only appear once toasts are queued), so asserting that this
    // single wrapper is in the DOM is the closest observable proxy for the
    // original "exactly one ToastContainer is rendered" assertion.
    const { container } = render(<Notification />);

    const toastContainers = container.querySelectorAll("section.Toastify");
    expect(toastContainers).toHaveLength(1);
    expect(toastContainers[0]).toHaveAttribute("aria-live", "polite");
  });
});
