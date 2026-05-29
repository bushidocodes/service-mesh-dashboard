import { waitForReact } from "testcafe-react-selectors";

import BaseInstanceViewModel from "../view-models/base-instance-view-model";
import FabricViewModel from "../view-models/fabric-view-model";
import ServiceViewModel from "../view-models/service-view-model";
import assertSorted from "../helpers/assert-sorted";

const instanceViewModel = new BaseInstanceViewModel();
const fabricViewModel = new FabricViewModel();
const serviceViewModel = new ServiceViewModel();

const defaultTimeout = 30;

// The following test all views common to both JVM and GO instance views
fixture`Instance View`.page`http://localhost:3000/`.beforeEach(async (t) => {
  await waitForReact();
  await t
    .click(fabricViewModel.linkStable)
    .click(fabricViewModel.servicesCards.nth(0))
    .click(serviceViewModel.instanceIDs.nth(0));
});

test("Verify Summary View Layout", async (t) => {
  //  Expect the 2 layout sections to be present
  await t
    .expect(instanceViewModel.summaryVitalsSection.exists)
    .ok()
    .expect(instanceViewModel.summaryStatisticsSection.exists)
    .ok();

  let attempts = 0,
    allReadoutsCount = 0;

  while (allReadoutsCount === 0 && attempts < defaultTimeout) {
    allReadoutsCount = await instanceViewModel.summaryAllReadouts.count;
    await t.wait(1000);
    attempts++;
  }

  // Expect that there are 3 readout cards
  await t.expect(allReadoutsCount).eql(3);

  let summaryUptimeReadoutText =
    await instanceViewModel.summaryUptimeReadout.innerText;

  await t
    .expect(summaryUptimeReadoutText)
    .match(/(\d{2,}d)\s+(\d{2}h)\s(\d{2}m)\s(\d{2}s)/g); // match format `000d 00h 00m 00s` https://regexr.com/3l5d8

  // Average Response Time readout
  const summaryAvgResponseTimeReadoutText =
    await instanceViewModel.summaryAvgResponseTimeReadout.find("span")
      .innerText;

  await t
    .expect(instanceViewModel.summaryAvgResponseTimeReadout.exists)
    .ok()
    .expect(summaryAvgResponseTimeReadoutText)
    .match(/[+-]?([0-9]*[.])?[0-9]+\s(ms)|-/g); // match `<float> ms` or a dash - https://regexr.com/3l5d5

  // Error Rate Readout
  const summaryErrorRateReadoutText =
    await instanceViewModel.summaryErrorRateReadout.find("span").innerText;

  await t
    .expect(instanceViewModel.summaryErrorRateReadout.exists)
    .ok()
    .expect(summaryErrorRateReadoutText)
    .match(/[+-]?([0-9]*[.])?[0-9]+%/g); // match`<float>%` https://regexr.com/3l5db

  // Requests per second chart
  const summaryRequestPerSecChartText =
    await instanceViewModel.summaryRequestPerSecChart.innerText;

  await t
    .expect(instanceViewModel.summaryRequestPerSecChart.exists)
    .ok()
    .expect(summaryRequestPerSecChartText)
    .contains("Requests Per Second");
});

test("Verify Routes/Functions Table Functionality", async (t) => {
  // Navigate to Routes
  await t.click(instanceViewModel.linkRoutes);

  //  Expect that there is at least 1 row rendered
  let routesTableRowsCount = await instanceViewModel.routesTableRows.count;
  await t.expect(routesTableRowsCount).gt(0);

  // There should be no charts in the DOM before a row has been clicked
  let aRoutesTableChart = await instanceViewModel.routesChart.count;
  await t.expect(aRoutesTableChart).eql(0);

  // Click a table row and expect that 1 chart is rendered
  let aRoutesTableRow = await instanceViewModel.routesTableRows.nth(-1);
  await t.click(aRoutesTableRow);
  aRoutesTableChart = await instanceViewModel.routesChart.count;
  await t.expect(aRoutesTableChart).eql(1);

  // Search
  await t.typeText(instanceViewModel.inputSearchRoutes, "r");
  routesTableRowsCount = await instanceViewModel.routesTableRows.count;
  await t.expect(routesTableRowsCount).gt(0);

  // Clear search and expect to see all routes
  await t.click(instanceViewModel.inputSearchRoutes).pressKey("ctrl+a delete");
  routesTableRowsCount = await instanceViewModel.routesTableRows.count;
  await t.expect(routesTableRowsCount).gt(0);

  /*/ Sorting /*/
  // Sort by Requests
  await t
    .click(instanceViewModel.selectSortRoutes)
    .click(instanceViewModel.optionSortRoutesRoute);

  //  Expect that the table rows are sorted in ascending order by requests
  await assertSorted(t, instanceViewModel.routesTableColsRequests);

  await t
    .click(instanceViewModel.selectSortRoutes)
    .click(instanceViewModel.optionSortRoutesStatus);

  // Expect the table rows are sorted in descending order by requests
  await assertSorted(t, instanceViewModel.routesTableColsRequests, false);

  // Sort by Error rate
  await t
    .click(instanceViewModel.selectSortRoutes)
    .click(instanceViewModel.optionSortRoutesError);

  // Expect that the table rows are sorted in descending order by error rate
  await assertSorted(t, instanceViewModel.routesTableColsError, false);

  await t
    .click(instanceViewModel.selectSortRoutes)
    .click(instanceViewModel.optionSortRoutesError);

  // Expect that the table rows are sorted in ascending order by error rate
  await assertSorted(t, instanceViewModel.routesTableColsError);

  // Sort by Latency 50%
  await t
    .click(instanceViewModel.selectSortRoutes)
    .click(instanceViewModel.optionSortRoutesLatency50);

  // Expect that the table rows are sorted in ascending order by latency 50%
  await assertSorted(t, instanceViewModel.routesTableColsLatency50);

  await t
    .click(instanceViewModel.selectSortRoutes)
    .click(instanceViewModel.optionSortRoutesLatency50);

  // Expect that the table rows are sorted in descending order by latency 50%
  await assertSorted(t, instanceViewModel.routesTableColsLatency50, false);

  // Sort by Latency 99%
  await t
    .click(instanceViewModel.selectSortRoutes)
    .click(instanceViewModel.optionSortRoutesLatency99);

  // Expect that the table rows are sorted in descending order by latency 99%
  await assertSorted(t, instanceViewModel.routesTableColsLatency99, false);

  await t
    .click(instanceViewModel.selectSortRoutes)
    .click(instanceViewModel.optionSortRoutesLatency99);

  // Expect that the table rows are sorted in ascending order by latency 99%
  await assertSorted(t, instanceViewModel.routesTableColsLatency99);
});

test("Verify Explorer View Functionality", async (t) => {
  // Navigate to Explorer
  let attempts = 0,
    isExplorerLinkVisible = 0;

  while (!isExplorerLinkVisible && attempts < defaultTimeout) {
    isExplorerLinkVisible = await instanceViewModel.linkExplorer.visible;
    await t.wait(1000);
    attempts++;
  }

  await t.click(instanceViewModel.linkExplorer);

  // Expect that no graph is rendered yet
  let inspectorGraphCount = await instanceViewModel.inspectorGraph.count;
  await t.expect(inspectorGraphCount).eql(0);

  // Click the first inspector item
  const firstItem = await instanceViewModel.inspectorItems.nth(0);
  const firstItemTitle =
    await instanceViewModel.inspectorItems.nth(0).innerText;
  await t.click(firstItem);

  const firstItemGraphTitle =
    await instanceViewModel.inspectorGraphTitleText.innerText;

  // Expect that a graph is rendered with the correct title
  inspectorGraphCount = await instanceViewModel.inspectorGraph.count;
  await t
    .expect(inspectorGraphCount)
    .eql(1)
    .expect(firstItemTitle)
    .eql(firstItemGraphTitle);

  // Grab the first inspector item text to use as a search string
  const searchString = await instanceViewModel.inspectorItems.nth(0).innerText;

  await t.typeText(instanceViewModel.inputSearchMetrics, searchString, {
    paste: true
  });

  let allInspectorItemsCount = await instanceViewModel.inspectorItems.count;

  // Loop through all items and make sure they contain the search string
  for (let i = 0; i < allInspectorItemsCount; i++) {
    await t
      .expect(
        await instanceViewModel.inspectorItems
          .nth(i)
          .innerText.then((text) => text.toLowerCase())
      )
      .contains(
        searchString.toLowerCase(),
        "No items contain the search string"
      );
  }

  // Clear the search and type nonsense to verify that no services appear
  await t.click(instanceViewModel.inputSearchMetrics).pressKey("ctrl+a delete");
  await t.typeText(instanceViewModel.inputSearchMetrics, "bananagrams");
  allInspectorItemsCount = await instanceViewModel.inspectorItems.count;
  await t.expect(allInspectorItemsCount).eql(0, "Item count does not equal 0");

  // Check and uncheck "Hide all metrics with only zero values" checkbox
  await t
    .click(instanceViewModel.checkboxHideZero)
    .click(instanceViewModel.checkboxHideZero);

  // "Hide all static metrics" should check and and disable the "Hide all metrics with only zero values" checkbox
  await t
    .click(instanceViewModel.checkboxHideStatic)
    .expect(instanceViewModel.checkboxHideZero.checked)
    .ok()
    .expect(instanceViewModel.checkboxHideZero.hasAttribute("disabled"))
    .ok()
    .click(instanceViewModel.checkboxHideStatic)
    .expect(instanceViewModel.checkboxHideZero.checked)
    .notOk();
});
