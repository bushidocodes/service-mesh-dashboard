import HTTPDelete from "components/Glyphs/HttpDelete";
import HTTPGet from "components/Glyphs/HttpGet";
import HTTPPatch from "components/Glyphs/HttpPatch";
import HTTPPost from "components/Glyphs/HttpPost";
import HTTPPut from "components/Glyphs/HttpPut";
import { ICON_VIEWBOX_SIZE } from "style/styleVariables";
import { upperFirst } from "utils/collections";
import Bars from "./Bars";
import Bell from "./Bell";
import Card from "./Card";
import Close from "./Close";
import Cog from "./Cog";
import Configuration from "./Configuration";
import CPU from "./CPU";
import Docs from "./Docs";
import EditGraph from "./EditGraph";
import EKG from "./EKG";
import ErrorList from "./ErrorList";
import Exclamation from "./Exclamation";
import Explorer from "./Explorer";
import Fabric from "./Fabric";
import Finagle from "./Finagle";
import Functions from "./Functions";
import GitHub from "./GitHub";
import GRPC from "./GRPC";
import Http from "./Http";
import Info from "./Info";
import Instances from "./Instances";
import JVM from "./JVM";
import Key from "./Key";
import LinkedIn from "./LinkedIn";
import List from "./List";
import Memory from "./Memory";
import Negation from "./Negation";
import NoKey from "./NoKey";
import NoMetrics from "./NoMetrics";
import Pause from "./Pause";
import Person from "./Person";
import Play from "./Play";
import Poll from "./Poll";
import Power from "./Power";
import Rows from "./Rows";
import RunningSmall from "./RunningSmall";
import Scale from "./Scale";
import Scatterplot from "./Scatterplot";
import Service from "./Service";
import ServiceInstance from "./ServiceInstance";
import ServicesWhite from "./ServicesWhite";
import StarFilled from "./StarFilled";
import Summary from "./Summary";
import Tape from "./Tape";
import Threads from "./Threads";
import Timer from "./Timer";
import Twitter from "./Twitter";
import ViewCollapse from "./ViewCollapse";

// import all glyph components

const glyphs = {
  Bars,
  Bell,
  CPU,
  Card,
  Close,
  Cog,
  Configuration,
  DELETE: HTTPDelete,
  Docs,
  EKG,
  EditGraph,
  ErrorList,
  Exclamation,
  Explorer,
  Fabric,
  Finagle,
  Functions,
  GET: HTTPGet,
  GRPC,
  GitHub,
  Go: JVM,
  Http,
  Info,
  Instances,
  JVM,
  Key,
  LinkedIn,
  List,
  Memory,
  Negation,
  NoKey,
  NoMetrics,
  PATCH: HTTPPatch,
  POST: HTTPPost,
  PUT: HTTPPut,
  Pause,
  Person,
  Play,
  Poll,
  Power,
  Rows,
  RunningSmall,
  Scale,
  Scatterplot,
  Service,
  ServiceInstance,
  ServicesWhite,
  StarFilled,
  Summary,
  Tape,
  Threads,
  Timer,
  Twitter,
  ViewCollapse
};

/** Registered glyph names (keys of the internal map). Used by the registry smoke test. */
export const GLYPH_NAMES = Object.keys(glyphs);

interface GlyphProps {
  glyphColor?: string;
  name?: string;
  ratio?: string | number;
}

/**
 * Returns Glyph by glyph name, or empty <g> if not found.
 */
export default function Glyph({
  name,
  ratio = 1,
  glyphColor = "currentColor"
}: GlyphProps) {
  // use upperFirst instead of capitalize to respect camelCase
  const resolvedName = upperFirst(name);

  // if glyph name is not found, return empty glyph
  if (!(glyphs as Record<string, any>)[resolvedName]) {
    return <g />;
  }
  // dynamically render glyph component by name
  const GlyphComponent = (glyphs as Record<string, any>)[resolvedName];

  const viewBoxSize = ICON_VIEWBOX_SIZE;
  const glyphTranslateDist = (Number(ratio) - 1) * (0.5 * viewBoxSize) * -1;

  return (
    <g
      className="glyph"
      fill={glyphColor}
      transform={
        "translate(" +
        glyphTranslateDist +
        " " +
        glyphTranslateDist +
        ") scale(" +
        ratio +
        ")"
      }
    >
      <GlyphComponent />
    </g>
  );
}
