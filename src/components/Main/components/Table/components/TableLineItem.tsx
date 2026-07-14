import Glyph from "components/Glyphs/index";
import Icon from "components/Icon";
import GMLineChart from "components/Main/components/GMLineChart";
import SparklineCol from "components/Main/components/SparklineCol";
import TableCol from "components/Main/components/TableCol";
import TableColVizBar from "components/Main/components/TableColVizBar";
import TableDrawerCollapse from "components/Main/components/TableDrawerCollapse";
import TableRow from "components/Main/components/TableRow";
import VizBar from "components/Main/components/VizBar";
import VizFill from "components/Main/components/VizFill";
import Badge from "components/Main/scenes/InstanceView/components/Badge";
import {
  Sparklines,
  SparklinesLine,
  SparklinesReferenceLine
} from "components/Sparklines";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import { blurTableRow } from "utils";

interface TableLineItemProps {
  errorPercent: string;
  item: string;
  latency50: number;
  latency99: number;
  relativeReqPercent?: number;
  requests?: number;
  requestsPerSecond_dygraph: Record<string, unknown>;
  requestsPerSecond_sparkline: number[];
  verb?: string;
}

// this extra flex container is necessary to truncate route name in chrome browser
const FlexParent = styled.div`
  display: flex;
  align-items: center;
  > div {
    margin-top: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }
`;

/**
 * A row of data in Functions and Routes table
 */
function TableLineItem({
  errorPercent,
  item,
  latency50,
  latency99,
  relativeReqPercent,
  requests,
  requestsPerSecond_dygraph,
  requestsPerSecond_sparkline,
  verb
}: TableLineItemProps) {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);

  // In IE10, IE11, and Edge browser, SVG elements are added to tab order by default and tabIndex is ignored.
  // setting focusable: "false" attribute to svg will make svg unfocusable.
  // Sparkline module returns its own svg element so the attribute is set here instead of being
  // set directly on svg.
  useEffect(() => {
    const sparklineSVG = document.querySelectorAll("svg[preserveAspectRatio]");
    sparklineSVG.forEach((svg) => svg.setAttribute("focusable", "false"));
  }, []);

  const toggleDrawer = (e?: any) => {
    if (e) {
      blurTableRow(e);
    }
    setIsOpen((open) => !open);
  };

  return (
    <TableRow
      selectable
      data-testid="data-row"
      isOpen={isOpen}
      onClick={(evt) => toggleDrawer(evt)}
      onKeyDown={(evt) => {
        if (evt.keyCode === 13) {
          evt.preventDefault();
          toggleDrawer();
        }
      }}
      role="link"
    >
      <TableColVizBar>
        <FlexParent>
          {verb && (
            <Badge>
              <Icon>
                <Glyph name={verb} />
              </Icon>
              {verb}
            </Badge>
          )}
          <div>{item}</div>
        </FlexParent>
        <VizBar>
          <VizFill
            width={relativeReqPercent}
            colorDegree={Number(errorPercent)}
          />
        </VizBar>
      </TableColVizBar>
      <SparklineCol>
        <Sparklines
          data={requestsPerSecond_sparkline}
          height={32}
          preserveAspectRatio="xMaxYMin"
        >
          <SparklinesLine
            style={{
              stroke: "currentColor",
              strokeWidth: 1,
              fill: "none"
            }}
          />
          <SparklinesReferenceLine
            style={{
              stroke: "grey",
              opacity: "0.4"
            }}
            type="mean"
          />
        </Sparklines>
      </SparklineCol>
      <TableCol style={{ textAlign: "right" }} data-testid="route-requests">
        {requests && requests.toLocaleString()}
      </TableCol>
      <TableCol style={{ textAlign: "right" }} errorPercent={errorPercent}>
        {errorPercent}%
      </TableCol>
      <TableCol
        style={{
          textAlign: "right",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div>{latency50.toLocaleString()} ms</div>
        <div>{latency99.toLocaleString()} ms</div>
      </TableCol>
      <TableDrawerCollapse
        isOpened={isOpen}
        onClick={(evt) => {
          evt.stopPropagation();
          blurTableRow(evt);
        }}
      >
        <GMLineChart
          dygraph={requestsPerSecond_dygraph}
          title={intl.formatMessage(
            {
              id: "tableLineItem.requests",
              defaultMessage: "Requests over Time for {item}",
              description: "Line chart title"
            },
            { item }
          )}
        />
      </TableDrawerCollapse>
    </TableRow>
  );
}

export default TableLineItem;
