import BackgroundCircleSmall from "./components/BackgroundCircleSmall";
import BackgroundSquare from "./components/BackgroundSquare";
import BackgroundSquareBeveled from "./components/BackgroundSquareBeveled";
import BackgroundSquareRounded from "./components/BackgroundSquareRounded";
import BackgroundSquareRoundedSmooth from "./components/BackgroundSquareRoundedSmooth";
import BackgroundSquareSmall from "./components/BackgroundSquareSmall";
import BackgroundSquircle from "./components/BackgroundSquircle";
import BackgroundTriangle from "./components/BackgroundTriangle";
import BackgroundTriangleSmall from "./components/BackgroundTriangleSmall";

interface IconBackgroundProps {
  backgroundColor?: string;
  backgroundOpacity?: string | number;
  name?: string;
  ratio?: string | number;
}

// import all icon components
const backgroundStyles = {
  BackgroundCircleSmall,
  BackgroundSquareSmall,
  BackgroundTriangleSmall,
  BackgroundSquare,
  BackgroundSquareBeveled,
  BackgroundSquareRounded,
  BackgroundSquareRoundedSmooth,
  BackgroundSquircle,
  BackgroundTriangle
};

export default function IconBackground({
  name = "BackgroundSquare",
  backgroundColor = "red",
  backgroundOpacity = "1"
}: IconBackgroundProps) {
  // dynamically render glyph component by name
  const IconBackgroundComponent = (backgroundStyles as Record<string, any>)[
    name
  ];
  return (
    <IconBackgroundComponent
      name={name}
      backgroundColor={backgroundColor}
      backgroundOpacity={backgroundOpacity}
    />
  );
}
