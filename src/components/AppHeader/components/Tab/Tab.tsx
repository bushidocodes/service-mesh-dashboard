import Glyph from "components/Glyphs/index";
import {
  Sparklines,
  SparklinesLine,
  SparklinesReferenceLine
} from "components/Sparklines";
import TabDetails from "./components/TabDetails";
import TabGraph from "./components/TabGraph";
import TabIcon from "./components/TabIcon";
import TabKey from "./components/TabKey";
import TabLink from "./components/TabLink";
import TabTitle from "./components/TabTitle";
import TabVal from "./components/TabVal";

interface TabProps {
  chartData?: any[];
  href?: string;
  icon?: string;
  lines?: any[];
  title?: string;
  tabIndex?: number;
}

/**
 * Stateless functional React component that renders the navigation tabs in AppHeader
 * @param {Object[]} props - See propTypes
 * @returns JSX.Element
 */
function Tab({ href, icon, lines = [], title, chartData }: TabProps) {
  return (
    <TabLink to={href} data-testid="nav-tab">
      <TabTitle>
        <TabIcon name={icon}>
          <Glyph name={icon} />
        </TabIcon>
        <h1>{title}</h1>
      </TabTitle>
      {lines.map((item) => {
        return (
          <TabDetails key={item.name}>
            <TabKey>{item.name}</TabKey>
            <TabVal>{item.value}</TabVal>
          </TabDetails>
        );
      })}
      {chartData ? (
        <TabGraph>
          <Sparklines data={chartData} height={24} preserveAspectRatio="none">
            <SparklinesLine
              style={{
                stroke: "currentColor",
                strokeWidth: 1,
                fill: "none"
              }}
            />
            <SparklinesReferenceLine
              style={{ stroke: "currentColor", opacity: "0.5" }}
              type="mean"
            />
          </Sparklines>
        </TabGraph>
      ) : null}
    </TabLink>
  );
}

export default Tab;
