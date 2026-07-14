import Exclamation from "components/Glyphs/Exclamation";
import Negation from "components/Glyphs/Negation";
import RunningSmall from "components/Glyphs/RunningSmall";
import Icon from "components/Icon";
import ServicesIcon from "images/icons/services.svg";
import {
  COLOR_DANGER,
  COLOR_SUCCESS,
  COLOR_WARNING
} from "style/styleVariables";

interface StatusIconProps {
  backgroundColor?: string;
  iconRatio?: string;
  status?: string;
}

export default function StatusIcon({
  status = "down",
  backgroundColor,
  iconRatio
}: StatusIconProps) {
  if (status.toLowerCase() === "down") {
    const downBackgroundColor = backgroundColor || COLOR_DANGER.string();
    const downGlyphColor = backgroundColor || COLOR_DANGER.string();
    return (
      <Icon
        backgroundColor={downBackgroundColor}
        glyphColor={downGlyphColor}
        backgroundStyle="BackgroundSquareSmall"
        backgroundOpacity=".3"
        iconRatio={iconRatio}
      >
        <Negation />
      </Icon>
    );
  } else if (status.toLowerCase() === "warning") {
    const warningBackgroundColor =
      backgroundColor || COLOR_WARNING.darken(0.1).saturate(0.1).string();
    const warningGlyphColor =
      backgroundColor || COLOR_WARNING.darken(0.2).saturate(1).string();
    return (
      <Icon
        backgroundColor={warningBackgroundColor}
        glyphColor={warningGlyphColor}
        backgroundStyle="BackgroundTriangleSmall"
        backgroundOpacity=".3"
        iconRatio={iconRatio}
      >
        <Exclamation />
      </Icon>
    );
  } else if (status.toLowerCase() === "stable") {
    const stableBackgroundColor = backgroundColor || COLOR_SUCCESS.string();
    const stableGlyphColor = backgroundColor || COLOR_SUCCESS.string();
    return (
      <Icon
        backgroundColor={stableBackgroundColor}
        glyphColor={stableGlyphColor}
        backgroundStyle="BackgroundCircleSmall"
        backgroundOpacity=".3"
        iconRatio={iconRatio}
      >
        <RunningSmall />
      </Icon>
    );
  } else {
    return <img src={ServicesIcon} alt="" />;
  }
}
