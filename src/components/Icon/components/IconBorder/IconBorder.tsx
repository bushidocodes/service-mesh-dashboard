import BorderCircleSmall from "./components/BorderCircleSmall";
import BorderSquare from "./components/BorderSquare";
import BorderSquareSmall from "./components/BorderSquareSmall";
import BorderTriangleSmall from "./components/BorderTriangleSmall";

interface IconBorderProps {
  borderColor?: string;
  borderOpacity?: string | number;
  borderWidth?: any;
  name?: string;
  ratio?: any;
}

// import all icon Border components
const borderStyles = {
  BorderSquare,
  BorderSquareSmall,
  BorderTriangleSmall,
  BorderCircleSmall
};

export default function IconBorder({
  ratio = 1,
  name = "BorderSquare",
  borderColor = "transparent",
  borderOpacity = 1,
  borderWidth = 1
}: IconBorderProps) {
  // dynamically render glyph component by name
  const IconBorderComponent = (borderStyles as Record<string, any>)[name];
  return (
    <g
      id={name}
      className="iconBorder"
      stroke={borderColor}
      strokeOpacity={borderOpacity}
      strokeWidth={borderWidth / ratio}
      fill="transparent"
    >
      <IconBorderComponent name={name} />
    </g>
  );
}
