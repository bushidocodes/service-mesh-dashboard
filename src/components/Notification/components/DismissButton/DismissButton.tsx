import Close from "components/Glyphs/Close";

import Icon from "components/Icon";

import DismissButtonContainer from "./components/DismissButtonContainer";

interface DismissButtonProps {
  // react-toastify passes `closeToast` into the toast content; we forward it
  // here so clicking the dismiss glyph closes the toast.
  onClick?: (...args: any[]) => any;
}

function DismissButton({ onClick }: DismissButtonProps) {
  return (
    <DismissButtonContainer onClick={onClick} aria-label="Dismiss">
      <Icon>
        <Close />
      </Icon>
    </DismissButtonContainer>
  );
}

export default DismissButton;
