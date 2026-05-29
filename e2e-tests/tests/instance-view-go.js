import { waitForReact } from "testcafe-react-selectors";

import InstanceGoViewModel from "../view-models/instance-go-view-model";
import FabricViewModel from "../view-models/fabric-view-model";
import ServiceViewModel from "../view-models/service-view-model";

const instanceViewModel = new InstanceGoViewModel();
const fabricViewModel = new FabricViewModel();
const serviceViewModel = new ServiceViewModel();

fixture`Instance View: Go`.page`http://localhost:3000/`.beforeEach(
  async (t) => {
    await waitForReact();
    await t
      .click(fabricViewModel.linkStable)
      .click(fabricViewModel.servicesCards.withText("GO"))
      .click(serviceViewModel.instanceIDs.nth(0));
  }
);

const defaultTimeout = 30;

test("Validate Basic Instance View (Go) Layout", async (t) => {
  let attempts = 0,
    allTabCount = 0;

  while (allTabCount === 0 && attempts < defaultTimeout) {
    allTabCount = await instanceViewModel.linkAllTabs.count;
    await t.wait(1000);
    attempts++;
  }

  allTabCount = await instanceViewModel.linkAllTabs.count;

  await t.expect(allTabCount).eql(5);
});

test("Summary View", async (t) => {
  /*/ Summary view (Go specific items)
      Tests for other summary view items can be found in ./base-instance-view.js
  /*/
  const summaryHostCPUReadoutText =
    await instanceViewModel.summaryHostCPUReadout.find("span").innerText;

  await t
    .expect(instanceViewModel.summaryHostCPUReadout.exists)
    .ok()
    .expect(summaryHostCPUReadoutText)
    .match(/[+-]?([0-9]*[.])?[0-9]+\s(%)/); // match `<float> %` https://regexr.com/3l5b3

  const summaryMemoryReadoutText =
    await instanceViewModel.summaryMemoryReadout.find("span").innerText;

  await t
    .expect(instanceViewModel.summaryMemoryReadout.exists)
    .ok()
    .expect(summaryMemoryReadoutText)
    .match(/[+-]?([0-9]*[.])?[0-9]+\s(MB)|-/); // match `<float> MB` or a dash - https://regexr.com/3l5bi
});

test("Go View", async (t) => {
  // Navigate to GO view
  await t.click(instanceViewModel.linkGo);

  // Expect that 2 grid items are rendered
  const goGridCount = await instanceViewModel.allGrids.count;
  await t.expect(goGridCount).eql(2);

  // Expect that they include the correct titles
  const goGrid1Text = await instanceViewModel.goGrid1.innerText;
  const goGrid2Text = await instanceViewModel.goGrid2.innerText;

  await t.expect(goGrid1Text).contains("Heap");
  await t.expect(goGrid2Text).contains("Goroutines");
});
