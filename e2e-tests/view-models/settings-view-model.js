import { ReactSelector } from "testcafe-react-selectors";
import BaseView from "./base-view-model";
import messages from "../../src/messages";

export default class SettingsViewModel extends BaseView {
  constructor(locale = "en-US") {
    super();

    this.fabricPollingButton = ReactSelector("ButtonWrap button").nth(0);
    this.fabricInputSlider = ReactSelector("InputRange").nth(0);
    this.instancePollingButton = ReactSelector("ButtonWrap button").nth(1);
    this.instanceInputSlider = ReactSelector("InputRange").nth(1);

    this.cacheSizeText = ReactSelector("ReadoutItemValue");
    this.clearCacheButton = ReactSelector("ButtonWrap").withAttribute(
      "title",
      messages[locale]["settingsGrid"]["clearCache"]
    );
    this.clearCacheModalCancelButton = ReactSelector(
      "ButtonWrap"
    ).withAttribute("title", "Cancel");
    this.clearCacheModalConfirmButton = ReactSelector(
      "ButtonWrap"
    ).withAttribute("title", "Confirm");
  }
}
