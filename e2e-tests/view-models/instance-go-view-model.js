import { ReactSelector } from "testcafe-react-selectors";
import { Selector } from "testcafe";
import BaseInstanceViewModel from "./base-instance-view-model";
import messages from "../../src/messages";

export default class InstanceGoViewModel extends BaseInstanceViewModel {
  constructor(locale = "en-US") {
    super();
    // Summary
    this.summaryHostCPUReadout = ReactSelector(
      "ReadoutDisplay ItemDisplay"
    ).withText("Host CPU Utilized");
    this.summaryMemoryReadout = ReactSelector(
      "ReadoutDisplay ItemDisplay"
    ).withText("Memory Utilized");

    // Navigation
    this.linkFunctions = ReactSelector("TabLink").withText(
      messages[locale]["goHeaderContent"]["functions"]
    );
    this.textDetailFunctions = ReactSelector("TabLink")
      .withText(messages[locale]["goHeaderContent"]["functions"])
      .find("dd");
    this.linkGo = ReactSelector("TabLink").withText("Go");
    this.textDetailGo = ReactSelector("TabLink").withText("Go").find("dd");

    // Go
    this.allGrids = Selector(".react-grid-item");
    this.goGrid1 = Selector(".react-grid-item").nth(0);
    this.goGrid2 = Selector(".react-grid-item").nth(1);
  }
}
