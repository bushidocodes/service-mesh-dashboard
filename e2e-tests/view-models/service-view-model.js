import { ReactSelector } from "testcafe-react-selectors";
import { Selector } from "testcafe";
import BaseViewModel from "./base-view-model";
import messages from "../../src/messages";

export default class ServiceViewModel extends BaseViewModel {
  constructor(locale = "en-US") {
    super();

    // Navigation
    this.linkInstances = ReactSelector("TabLink").withText(
      messages[locale]["serviceHeaderContent"]["instances"]
    );
    this.textInstancesCount = ReactSelector("TabLink")
      .withText(messages[locale]["serviceHeaderContent"]["instances"])
      .find("dd");

    // Toolbar
    this.inputSearchInstances = ReactSelector("ToolbarLeft").find("input");
    this.selectSort = Selector(".gm-select__control").withText(
      messages[locale]["tableToolbar"]["sort"]
    );
    // this.selectSort needs to be selected first
    // so that the following options are created in the DOM
    this.optionSortName = Selector(".gm-select__option").withText(
      messages[locale]["serviceView"]["name"]
    );
    this.optionSortStatus = Selector(".gm-select__option").withText(
      messages[locale]["serviceView"]["uptime"]
    );

    // Instance table
    this.tableRows = ReactSelector("TableRow");
    this.instanceIDs = ReactSelector("TableCol").find("a");
    this.instanceUptimes = ReactSelector("ArrayValue");
  }
}
