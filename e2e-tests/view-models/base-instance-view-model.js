import { ReactSelector } from "testcafe-react-selectors";
import { Selector } from "testcafe";
import BaseViewModel from "./base-view-model";
import messages from "../../src/messages";

export default class BaseInstanceViewModel extends BaseViewModel {
  constructor(locale = "en-US") {
    super();
    // The following selectors are common to both JVM and GO instance views

    // Navigation
    this.linkSummary = ReactSelector("TabLink").withText(
      messages[locale]["goHeaderContent"]["summary"]
    );
    this.textUptimeCount = ReactSelector("TabLink")
      .withText(messages[locale]["goHeaderContent"]["summary"])
      .find("dd");
    this.linkRoutes = ReactSelector("TabLink").withText(
      messages[locale]["goHeaderContent"]["routes"]
    );
    this.textRoutesCount = ReactSelector("TabLink")
      .withText(messages[locale]["goHeaderContent"]["routes"])
      .find("dd");
    this.linkExplorer = ReactSelector("TabLink").withText(
      messages[locale]["goHeaderContent"]["explorer"]
    );

    // Summary view
    this.summaryUptimeReadout = ReactSelector("ReadoutDisplay").withText(
      messages[locale]["summary"]["uptime"]
    );
    this.summaryVitalsSection = ReactSelector("Header").withText(
      messages[locale]["summary"]["vitals"]
    );
    this.summaryStatisticsSection = ReactSelector("Header").withText(
      messages[locale]["summary"]["statistics"]
    );
    this.summaryAllReadouts = ReactSelector("Readout");
    this.summaryUptimeReadout = ReactSelector("ArrayValue").nth(1);
    this.summaryRequestPerSecChart = ReactSelector("LineChartDisplay").withText(
      messages[locale]["summary"]["requestsPerSecond"]
    );
    this.summaryAvgResponseTimeReadout = ReactSelector(
      "ReadoutDisplay ItemDisplay"
    ).withText(messages[locale]["summary"]["responseTime"]);
    this.summaryErrorRateReadout = ReactSelector(
      "ReadoutDisplay ItemDisplay"
    ).withText(messages[locale]["summary"]["errorRate"]);

    // Routes View
    this.inputSearchRoutes = ReactSelector("ToolbarLeft").find("input");
    this.routesTableRows = ReactSelector("TableRow");
    this.routesTableColsRequests = ReactSelector("TableCol").withAttribute(
      "name",
      messages[locale]["routesGrid"]["requests"]
    );
    this.routesTableColsError = ReactSelector("TableCol").withAttribute(
      "name",
      messages[locale]["routesGrid"]["errorPercent"]
    );
    this.routesTableColsLatency50 = ReactSelector("TableCol").withAttribute(
      "name",
      messages[locale]["routesGrid"]["latency50"]
    );
    this.routesTableColsLatency99 = ReactSelector("TableCol").withAttribute(
      "name",
      messages[locale]["routesGrid"]["latency99"]
    );
    this.routesChart = ReactSelector("LineChartDisplay");
    this.routesChartTitle = ReactSelector("LineChartTitle");
    this.selectSortRoutes = Selector(".gm-select__control").withText(
      messages[locale]["tableToolbar"]["sort"]
    );
    // this.selectSort needs to be selected first
    // so that the following options are created in the DOM
    this.optionSortRoutesRoute = Selector(".gm-select__option").withText(
      messages[locale]["routesGrid"]["route"]
    );
    this.optionSortRoutesStatus = Selector(".gm-select__option").withText(
      messages[locale]["routesGrid"]["requests"]
    );
    this.optionSortRoutesError = Selector(".gm-select__option").withText(
      messages[locale]["routesGrid"]["errorPercent"]
    );
    this.optionSortRoutesLatency50 = Selector(".gm-select__option").withText(
      messages[locale]["routesGrid"]["latency50"]
    );
    this.optionSortRoutesLatency99 = Selector(".gm-select__option").withText(
      messages[locale]["routesGrid"]["latency99"]
    );

    // Explorer View
    this.inputSearchMetrics = ReactSelector("InspectorSearch input");
    this.checkboxHideZero = ReactSelector("InspectorHideZero");
    this.checkboxHideStatic = ReactSelector("InspectorHideStatic");
    this.inspectorItems = ReactSelector("InspectorItem");
    this.inspectorGraph = ReactSelector("LineChartDisplay");
    this.inspectorGraphTitleText = ReactSelector("LineChartTitle");
  }
}
