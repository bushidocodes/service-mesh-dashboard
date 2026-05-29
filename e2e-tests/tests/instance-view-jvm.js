import { waitForReact } from "testcafe-react-selectors";

import InstanceJvmViewModel from "../view-models/instance-jvm-view-model";
import FabricViewModel from "../view-models/fabric-view-model";
import ServiceViewModel from "../view-models/service-view-model";

const instanceViewModel = new InstanceJvmViewModel();
const fabricViewModel = new FabricViewModel();
const serviceViewModel = new ServiceViewModel();

fixture`Instance View: JVM`.page`http://localhost:3000/`.beforeEach(
  async (t) => {
    await waitForReact();
    await t
      .click(fabricViewModel.linkStable)
      .click(fabricViewModel.servicesCards.withText("JVM"))
      .click(serviceViewModel.instanceIDs.nth(0));
  }
);

const defaultTimeout = 30;

test("Validate Basic Instance View (JVM) Layout", async (t) => {
  let attempts = 0,
    allTabCount = 0;

  while (allTabCount === 0 && attempts < defaultTimeout) {
    allTabCount = await instanceViewModel.linkAllTabs.count;
    await t.wait(1000);
    attempts++;
  }

  allTabCount = await instanceViewModel.linkAllTabs.count;

  await t.expect(allTabCount).eql(7);
});

test("Summary View", async (t) => {
  /*/ Summary view (JVM specific items)
      Tests for other summary view items can be found in ./base-instance-view.js
  /*/
  const summaryHostCPUReadoutText =
    await instanceViewModel.summaryHostCPUReadout.find("span").innerText;

  await t
    .expect(instanceViewModel.summaryHostCPUReadout.exists)
    .ok()
    .expect(summaryHostCPUReadoutText)
    .match(/\d+/g); // match one or more digits https://regexr.com/3l5ef
});

test("Threads View", async (t) => {
  // Navigate to Threads view
  await t.click(instanceViewModel.linkThreads);

  // Expect that the thread count in the tab equals the total amount of threads
  const tabThreadCount = parseInt(
    await instanceViewModel.textThreadsCount.innerText,
    10
  );
  const totalThreadCount = await instanceViewModel.threadsTableRows.count;
  await t.expect(tabThreadCount).eql(totalThreadCount);

  // Click a table row and expect that 1 stack trace is rendered
  const firstTableRow = await instanceViewModel.threadsTableRows.nth(0);
  await t.click(firstTableRow);
  const stackTraceCount = await instanceViewModel.threadsStackTraces.count;
  await t.expect(stackTraceCount).eql(1);
});

test("HTTP View", async (t) => {
  // Navigate to HTTP view
  await t.click(instanceViewModel.linkHTTP);

  // Expect that 4 grid items are rendered
  const httpGridCount = await instanceViewModel.allHttpGrid.count;
  await t.expect(httpGridCount).eql(4);

  // Expect that 2 charts are rendered
  const httpChartCount = await instanceViewModel.httpCharts.count;
  await t.expect(httpChartCount).eql(2);

  // Expect that they include the correct titles
  const httpGrid1Text = await instanceViewModel.httpGrid1.textContent;
  const httpGrid2Text = await instanceViewModel.httpGrid2.textContent;
  const httpGrid3Text = await instanceViewModel.httpGrid3.textContent;
  const httpGrid4Text = await instanceViewModel.httpGrid4.textContent;

  await t.expect(httpGrid1Text).contains("Connections");
  await t.expect(httpGrid2Text).contains("Data Transfer Rates");
  await t.expect(httpGrid3Text).contains("Requests");
  await t.expect(httpGrid4Text).contains("Response Status Codes");
});

test("JVM View", async (t) => {
  // Navigate to HTTP view
  await t.click(instanceViewModel.linkJVM);

  // Expect that 2 grid items are rendered
  const jvmGridCount = await instanceViewModel.allJvmGrid.count;
  await t.expect(jvmGridCount).eql(2);

  // Expect that 2 charts are rendered
  const jvmChartCount = await instanceViewModel.jvmCharts.count;
  await t.expect(jvmChartCount).eql(2);

  // Expect that they include the correct titles
  const jvmGrid1Text = await instanceViewModel.jvmGrid1.textContent;
  const jvmGrid2Text = await instanceViewModel.jvmGrid2.textContent;

  await t.expect(jvmGrid1Text).contains("Heap");
  await t.expect(jvmGrid2Text).contains("Classes");
});

test("Finagle View", async (t) => {
  // Navigate to HTTP view
  await t.click(instanceViewModel.linkFinagle);

  // Expect that 4 grid items are rendered
  const finagleGridCount = await instanceViewModel.allFinagleGrid.count;
  await t.expect(finagleGridCount).eql(4);

  // Expect that they include the correct titles
  const finagleGrid1Text = await instanceViewModel.finagleGrid1.textContent;
  const finagleGrid2Text = await instanceViewModel.finagleGrid2.textContent;
  const finagleGrid3Text = await instanceViewModel.finagleGrid3.textContent;
  const finagleGrid4Text = await instanceViewModel.finagleGrid4.textContent;

  await t.expect(finagleGrid1Text).contains("Timer Deviation");
  await t.expect(finagleGrid2Text).contains("Pending Timer Tasks");
  await t.expect(finagleGrid3Text).contains("Future Pool");
  await t.expect(finagleGrid4Text).contains("Client Registry");
});
