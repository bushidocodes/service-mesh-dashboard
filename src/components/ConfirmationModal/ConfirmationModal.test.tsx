import { fireEvent, render, screen } from "@testing-library/react";
import ConfirmationModal from "./ConfirmationModal";

const defaultProps = {
  question: "Will this test pass?",
  secondary: "Only time will tell"
};

function renderModal(
  overrides: Partial<{
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
  }> = {}
) {
  const onCancel = overrides.onCancel ?? vi.fn();
  const onConfirm = overrides.onConfirm ?? vi.fn();
  const result = render(
    <ConfirmationModal
      isOpen={overrides.isOpen ?? false}
      onCancel={onCancel}
      onConfirm={onConfirm}
      question={defaultProps.question}
      secondary={defaultProps.secondary}
    />
  );
  return { ...result, onCancel, onConfirm };
}

describe("ConfirmationModal", () => {
  it("matches snapshot when closed", () => {
    const { asFragment } = renderModal({ isOpen: false });
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot when open", () => {
    const { asFragment } = renderModal({ isOpen: true });
    expect(asFragment()).toMatchSnapshot();
  });

  it("sets the dialog open attribute when isOpen is true", () => {
    renderModal({ isOpen: true });
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog).toHaveAttribute("open");
  });

  it("does not set the dialog open attribute when isOpen is false", () => {
    const { container } = renderModal({ isOpen: false });
    const dialog = container.querySelector("dialog");
    expect(dialog).not.toBeNull();
    expect(dialog).not.toHaveAttribute("open");
  });

  it("calls onCancel when Cancel is clicked", () => {
    const { onCancel, onConfirm } = renderModal({ isOpen: true });
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("calls onCancel when the close (X) control is clicked", () => {
    const { onCancel, onConfirm } = renderModal({ isOpen: true });
    fireEvent.click(screen.getByTestId("confirmation-modal-cancel-x"));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("calls onConfirm when Confirm is clicked", () => {
    const { onCancel, onConfirm } = renderModal({ isOpen: true });
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("calls onCancel and prevents default on the dialog cancel event (Esc)", () => {
    const { onCancel, container } = renderModal({ isOpen: true });
    const dialog = container.querySelector("dialog");
    expect(dialog).not.toBeNull();

    const cancelEvent = new Event("cancel", {
      bubbles: true,
      cancelable: true
    });
    dialog!.dispatchEvent(cancelEvent);

    expect(cancelEvent.defaultPrevented).toBe(true);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel for a backdrop-style click outside the dialog box", () => {
    const { onCancel, container } = renderModal({ isOpen: true });
    const dialog = container.querySelector("dialog") as HTMLDialogElement;
    vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue({
      left: 100,
      top: 100,
      right: 600,
      bottom: 500,
      width: 500,
      height: 400,
      x: 100,
      y: 100,
      toJSON: () => ({})
    });

    fireEvent.click(dialog, { clientX: 10, clientY: 10 });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("does not call onCancel for a click inside the dialog box", () => {
    const { onCancel, container } = renderModal({ isOpen: true });
    const dialog = container.querySelector("dialog") as HTMLDialogElement;
    vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue({
      left: 100,
      top: 100,
      right: 600,
      bottom: 500,
      width: 500,
      height: 400,
      x: 100,
      y: 100,
      toJSON: () => ({})
    });

    fireEvent.click(dialog, { clientX: 300, clientY: 300 });
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("ignores synthetic (0, 0) clicks that would otherwise look outside", () => {
    const { onCancel, container } = renderModal({ isOpen: true });
    const dialog = container.querySelector("dialog") as HTMLDialogElement;
    vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue({
      left: 100,
      top: 100,
      right: 600,
      bottom: 500,
      width: 500,
      height: 400,
      x: 100,
      y: 100,
      toJSON: () => ({})
    });

    fireEvent.click(dialog, { clientX: 0, clientY: 0 });
    expect(onCancel).not.toHaveBeenCalled();
  });
});
