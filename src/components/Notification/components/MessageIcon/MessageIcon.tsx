import Exclamation from "components/Glyphs/Exclamation";
import Icon from "components/Icon";
import MessageIconContainer from "./components/MessageIconContainer";

// Static error-style glyph used in toast overlays. Level-specific icons were
// never implemented; callers no longer pass a level prop.
function MessageIcon() {
  return (
    <MessageIconContainer className="notification-dismiss">
      <Icon
        iconRatio="5"
        borderStyle="BorderTriangleSmall"
        borderOpacity="1"
        borderWidth="2"
      >
        <Exclamation />
      </Icon>
    </MessageIconContainer>
  );
}

export default MessageIcon;
