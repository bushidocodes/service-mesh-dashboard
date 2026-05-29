import { ReactSelector } from "testcafe-react-selectors";
import BaseViewModel from "./base-view-model";
import { Selector } from "testcafe";
import messages from "../../src/messages";
import _ from "lodash";

export default class FabricViewModel extends BaseViewModel {
  constructor(locale = "en-US") {
    super();

    // Tab bar
    this.linkAllServices = ReactSelector("TabLink").withText(
      _.startCase(messages[locale]["fabricHeaderContent"]["allServices"])
    );
    this.textAllServicesCount = ReactSelector("TabLink")
      .withText(messages[locale]["fabricHeaderContent"]["allServices"])
      .find("dd");
    this.linkDown = ReactSelector("TabLink").withText(
      messages[locale]["fabricHeaderContent"]["down"]
    );
    this.textDownCount = ReactSelector("TabLink")
      .withText(messages[locale]["fabricHeaderContent"]["down"])
      .find("dd");
    this.linkWarning = ReactSelector("TabLink").withText(
      messages[locale]["fabricHeaderContent"]["warning"]
    );
    this.textWarningCount = ReactSelector("TabLink")
      .withText(messages[locale]["fabricHeaderContent"]["warning"])
      .find("dd");
    this.linkStable = ReactSelector("TabLink").withText(
      messages[locale]["fabricHeaderContent"]["stable"]
    );
    this.textStableCount = ReactSelector("TabLink")
      .withText(messages[locale]["fabricHeaderContent"]["stable"])
      .find("dd");

    // Filter bar
    this.inputSearchServices = ReactSelector("Toolbar").find("input");
    this.linkCards = ReactSelector("ButtonWrap").withAttribute(
      "title",
      messages[locale]["tableToolbar"]["cards"]
    );
    this.linkList = ReactSelector("ButtonWrap").withAttribute(
      "title",
      messages[locale]["tableToolbar"]["list"]
    );

    this.selectGroup = Selector(".gm-select__control").withText(
      messages[locale]["tableToolbar"]["group"]
    );
    // this.selectSort needs to be selected first,
    // so that the following options are created in the DOM
    this.optionGroupOwner = Selector(".gm-select__option").withText(
      messages[locale]["fabric"]["owner"]
    );
    this.optionGroupCapability = Selector(".gm-select__option").withText(
      messages[locale]["fabric"]["capability"]
    );
    this.optionGroupStatus = Selector(".gm-select__option").withText(
      messages[locale]["fabric"]["status"]
    );
    this.optionGroupNone = Selector(".gm-select__option").withText(
      messages[locale]["fabric"]["none"]
    );

    this.selectSort = Selector(".gm-select__control").withText(
      messages[locale]["tableToolbar"]["sort"]
    );
    // this.selectSort needs to be selected first,
    // so that the following options are created in the DOM
    this.optionSortName = Selector(".gm-select__option").withText(
      messages[locale]["fabric"]["name"]
    );
    this.optionSortStatus = Selector(".gm-select__option").withText(
      messages[locale]["fabric"]["status"]
    );

    // Grid
    // The following return all matching elements
    this.servicesGrid = ReactSelector("FabricMainView");
    this.servicesCards = ReactSelector("GMServiceCard");
    this.servicesList = ReactSelector("ServicesListItem");
    this.servicesSections = ReactSelector("GMServiceCardCollection");
    this.servicesHeaders = ReactSelector("GMServiceHeader");
    this.serviceCardsJVM = ReactSelector("GMServiceCard")
      .find("footer")
      .withText("JVM");
    this.serviceCardsGo = ReactSelector("GMServiceCard")
      .find("footer")
      .withText("GO");
  }
}
