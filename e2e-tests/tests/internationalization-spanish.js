import { waitForReact } from "testcafe-react-selectors";

import FabricViewModel from "../view-models/fabric-view-model";
import ServiceViewModel from "../view-models/service-view-model";
import BaseInstanceViewModel from "../view-models/base-instance-view-model";
import InstanceGoViewModel from "../view-models/instance-go-view-model";
import InstanceJvmViewModel from "../view-models/instance-jvm-view-model";
import SettingsViewModel from "../view-models/settings-view-model";

const spanishLocale = "es-ES";

const fabricViewEnglish = new FabricViewModel();
const fabricView = new FabricViewModel(spanishLocale);
const serviceView = new ServiceViewModel(spanishLocale);
const baseInstanceView = new BaseInstanceViewModel(spanishLocale);
const instanceGoView = new InstanceGoViewModel(spanishLocale);
const instanceJvmView = new InstanceJvmViewModel(spanishLocale);
const settingsView = new SettingsViewModel(spanishLocale);

fixture`Internationalization: Spanish`.page`http://localhost:3000/`.beforeEach(
  async (t) => {
    await waitForReact();
    await t
      .wait(5000)
      .click(fabricViewEnglish.linkLanguages)
      .click(fabricViewEnglish.linkLanguagesEs);
  }
);

test("Verify Fabric View", async (t) => {
  // Verify the tabs are present
  await t.expect(fabricView.linkAllServices.exists).ok();
  await t.expect(fabricView.linkDown.exists).ok();
  await t.expect(fabricView.linkWarning.exists).ok();
  await t.expect(fabricView.linkStable.exists).ok();

  // Verify view style controls are present
  await t.expect(fabricView.linkCards.exists).ok();
  await t.expect(fabricView.linkList.exists).ok();

  // Verify the Group select and option elements are present
  await t.expect(fabricView.selectGroup.exists).ok();
  await t.click(fabricView.selectGroup);
  await t.expect(fabricView.optionGroupOwner.exists).ok();
  await t.expect(fabricView.optionGroupCapability.exists).ok();
  await t.expect(fabricView.optionGroupStatus.exists).ok();
  await t.expect(fabricView.optionGroupNone.exists).ok();

  // Verify the Sort select and option elements are present
  await t.expect(fabricView.selectSort.exists).ok();
  await t.click(fabricView.selectSort);
  await t.expect(fabricView.optionSortName.exists).ok();
  await t.expect(fabricView.optionSortStatus.exists).ok();
});

test("Verify Service View", async (t) => {
  // Navigate to the service view
  await t.click(fabricView.linkStable);
  await t.click(fabricView.servicesCards.nth(0));

  // Verify the tabs are present
  await t.expect(serviceView.linkInstances.exists).ok();

  // Verify the Sort select and option elements are present
  await t.expect(serviceView.selectSort.exists).ok();
  await t.click(serviceView.selectSort);
  await t.expect(serviceView.optionSortName.exists).ok();
  await t.expect(serviceView.optionSortStatus.exists).ok();
});

test("Verify Instance View: Common", async (t) => {
  // Navigate to the service view
  await t.click(fabricView.linkStable);
  await t.click(fabricView.servicesCards.nth(0));

  // Navigate to the instance view
  await t.click(serviceView.instanceIDs.nth(0));

  // await t.expect(attempts < defaultTimeout);
  await t.expect(baseInstanceView.linkSummary.exists).ok();

  // Verify the other tabs are present
  await t.expect(baseInstanceView.linkRoutes.exists).ok();
  await t.expect(baseInstanceView.linkExplorer.exists).ok();

  // Verify the expected elements on the Summary tab are present
  await t.click(baseInstanceView.linkSummary);

  await t.expect(baseInstanceView.summaryUptimeReadout.exists).ok();
  await t.expect(baseInstanceView.summaryRequestPerSecChart.exists).ok();
  await t.expect(baseInstanceView.summaryAvgResponseTimeReadout.exists).ok();
  await t.expect(baseInstanceView.summaryErrorRateReadout.exists).ok();

  // Navigate to the Routes view and verify the expected elements are present
  await t.click(baseInstanceView.linkRoutes);

  await t.expect(baseInstanceView.selectSortRoutes.exists).ok();
  await t.click(baseInstanceView.selectSortRoutes);
  await t.expect(baseInstanceView.optionSortRoutesRoute.exists).ok();
  await t.expect(baseInstanceView.optionSortRoutesStatus.exists).ok();
  await t.expect(baseInstanceView.optionSortRoutesError.exists).ok();
  await t.expect(baseInstanceView.optionSortRoutesLatency50.exists).ok();
  await t.expect(baseInstanceView.optionSortRoutesLatency99.exists).ok();
});

test("Validate Instance View: Go", async (t) => {
  // Navigate to the service view
  await t.click(fabricView.linkStable);
  // Click the first Go Service
  await t.click(fabricView.serviceCardsGo.nth(0));

  // Navigate to the instance view
  await t.click(serviceView.instanceIDs.nth(0));

  // Verify the Go-specific tabs are present
  await t.expect(instanceGoView.linkFunctions.exists).ok();
  await t.expect(instanceGoView.linkGo.exists).ok();
});

test("Validate Instance View: JVM", async (t) => {
  // Navigate back to the stable tab of the fabric view
  await t.click(fabricView.linkStable);

  // Click the first JVM Service
  await t.click(fabricView.serviceCardsJVM.nth(0));

  // Navigate to the instance view
  await t.click(serviceView.instanceIDs.nth(0));

  // Verify the JVM-specific tabs are present
  await t.expect(instanceJvmView.linkThreads.exists).ok();
  await t.expect(instanceJvmView.linkHTTP.exists).ok();
  await t.expect(instanceJvmView.linkJVM.exists).ok();
  await t.expect(instanceJvmView.linkFinagle.exists).ok();

  // Navigate to the Threads tab
  await t.click(instanceJvmView.linkThreads);

  // Verify the Group select and option elements are present
  await t.expect(instanceJvmView.selectGroupThreads.exists).ok();
  await t.click(instanceJvmView.selectGroupThreads);
  await t.expect(instanceJvmView.optionGroupThreadsState.exists).ok();
  await t.expect(instanceJvmView.optionGroupThreadsNone.exists).ok();

  // Verify the Sort select and option elements are present
  await t.expect(instanceJvmView.selectSortThreads.exists).ok();
  await t.click(instanceJvmView.selectSortThreads);
  await t.expect(instanceJvmView.optionSortThreadsState.exists).ok();
  await t.expect(instanceJvmView.optionSortThreadsID.exists).ok();
  await t.expect(instanceJvmView.optionSortThreadsName.exists).ok();
});

test("Validate Settings View", async (t) => {
  // Navigate to the settings view
  await t.click(fabricView.linkSettings);

  // Verify the Clear Cache button is present
  await t.expect(settingsView.clearCacheButton.exists).ok();

  // Click the Clear Cache button
  await t.click(settingsView.clearCacheButton);

  // Verify the Cancel and Confirm buttons are present
  await t.expect(settingsView.clearCacheModalCancelButton.exists).ok();
  await t.expect(settingsView.clearCacheModalConfirmButton.exists).ok();
});
