import Button from "components/Button";
import Glyph from "components/Glyphs";
import Icon from "components/Icon";
import { type MouseEvent, useEffect, useRef } from "react";
import { COLOR_DANGER } from "style/styleVariables";
import Actions from "./components/Actions";
import CancelX from "./components/CancelX";
import ConfirmationQuery from "./components/ConfirmationQuery";
import Content from "./components/Content";
import SecondaryText from "./components/SecondaryText";
import StyledModal from "./components/StyledModal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  question: string;
  secondary: string;
}

function ConfirmationModal({
  question,
  secondary,
  isOpen,
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isOpen && !el.open) {
      el.showModal();
    } else if (!isOpen && el.open) {
      el.close();
    }
  }, [isOpen]);

  // Backdrop click: coordinates fall outside the dialog box when the user
  // clicks the native ::backdrop layer (common modal-dialog pattern).
  // Ignore (0, 0) synthetic clicks that some harnesses emit without real coords.
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.clientX === 0 && event.clientY === 0) {
      return;
    }
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const clickedOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;
    if (clickedOutside) {
      onCancel();
    }
  };

  return (
    <StyledModal
      ref={ref}
      aria-labelledby="question"
      aria-describedby="secondaryText"
      onCancel={(event) => {
        // Keep the dialog controlled via isOpen — parent sets isOpen false,
        // then the effect above calls close().
        event.preventDefault();
        onCancel();
      }}
      onClick={handleClick}
    >
      <CancelX onClick={onCancel} data-testid="confirmation-modal-cancel-x">
        <Icon>
          <Glyph name="Close" />
        </Icon>
      </CancelX>
      <Content>
        <Icon
          backgroundColor={COLOR_DANGER.fade(0.2).string()}
          backgroundStyle="BackgroundTriangleSmall"
          glyphColor="white"
          iconRatio={6}
        >
          <Glyph name="Exclamation" />
        </Icon>
        <ConfirmationQuery id="question">{question}</ConfirmationQuery>
        <SecondaryText id="secondaryText">{secondary}</SecondaryText>
      </Content>
      <Actions>
        <Button clickAction={onCancel} label="Cancel" />
        <Button type="danger" clickAction={onConfirm} label="Confirm" />
      </Actions>
    </StyledModal>
  );
}

export default ConfirmationModal;
