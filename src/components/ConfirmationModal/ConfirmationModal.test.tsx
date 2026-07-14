import { render } from "@testing-library/react";
import Modal from "react-modal";
import ConfirmationModal from "./ConfirmationModal";

describe("ConfirmationModal", () => {
  beforeAll(() => {
    Modal.setAppElement(document.body);
  });

  it("matches snapshot when closed", () => {
    const { asFragment } = render(
      <ConfirmationModal
        isOpen={false}
        onCancel={() => {}}
        onConfirm={() => {}}
        question="Will this test pass?"
        secondary="Only time will tell"
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
  it("matches snapshot when open", () => {
    const { asFragment } = render(
      <ConfirmationModal
        isOpen={true}
        onCancel={() => {}}
        onConfirm={() => {}}
        question="Will this test pass?"
        secondary="Only time will tell"
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
