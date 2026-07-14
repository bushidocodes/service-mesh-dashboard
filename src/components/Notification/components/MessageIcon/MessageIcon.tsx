import Exclamation from "components/Glyphs/Exclamation";
import Icon from "components/Icon";
import MessageIconContainer from "./components/MessageIconContainer";

interface MessageIconProps {
  level?: "info" | "error" | "warning" | "success";
}

// Choose an icon to display based on level If Error, show error icon, etc.
function MessageIcon({ level = "info" }: MessageIconProps) {
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
