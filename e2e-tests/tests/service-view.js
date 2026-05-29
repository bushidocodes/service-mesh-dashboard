import { waitForReact } from "testcafe-react-selectors";

import FabricViewModel from "../view-models/fabric-view-model";
import ServiceViewModel from "../view-models/service-view-model";
import parseUptimeSeconds from "../helpers/uptime-parser";

fixture`Service View`.page`http://localhost:3000/`.beforeEach(async () => {
  await waitForReact();
});

const fabricView = new FabricViewModel();
const serviceView = new ServiceViewModel();

const defaultTimeout = 30;
const dummyInstanceId = "bananagrams";

test("Service View Sorting and Filtering", async (t) => {
  // Navigate to the Stable tab
  await t.click(fabricView.linkStable);

  // Verify that at least one service is displayed
  var attempts = 0;
  var stableServicesCardsCount = 0;

  while (stableServicesCardsCount === 0 && attempts < defaultTimeout) {
    stableServicesCardsCount = await fabricView.servicesCards.count;
    await t.wait(1000);
    attempts++;
  }

  await t.expect(stableServicesCardsCount).notEql(0);

  // Find an service that has at least two instances
  var serviceIndex = 0;
  var instanceCount = 0;

  while (instanceCount <= 1) {
    // Navigate to the service view for a service
    await t.click(fabricView.servicesCards.nth(serviceIndex));

    // Count the number of instances for the service
    instanceCount = await serviceView.tableRows.count;

    // If there are less than two instances shown, navigate back to the Stable tab in the fabric view
    if (instanceCount < 2) {
      await t.click(serviceView.linkFabric);
      await t.click(fabricView.linkStable);
    }

    // Increment the service index
    serviceIndex++;
  }

  // Get the ID of the first instance in the table
  var instanceId = await serviceView.instanceIDs.nth(0).textContent;

  await t
    .typeText(serviceView.inputSearchInstances, instanceId, { paste: true })
    .wait(2000);

  // Verify that one and only one instance is listed and that its ID matches the search string
  await t.expect(serviceView.instanceIDs.count).eql(1);
  await t.expect(serviceView.instanceIDs.nth(0).textContent).eql(instanceId);

  // Clear the value from the Search Instances field
  await t.click(serviceView.inputSearchInstances).pressKey("ctrl+a delete");

  // Verify that the original number of instances is listed
  await t.expect(serviceView.instanceIDs.count).eql(instanceCount);

  await t
    .typeText(serviceView.inputSearchInstances, dummyInstanceId, {
      paste: true
    })
    .wait(2000);

  // Verify that no instances are listed
  await t.expect(serviceView.instanceIDs.count).eql(0);

  // Clear the value from the Search Instances field
  await t.click(serviceView.inputSearchInstances).pressKey("ctrl+a delete");

  // Sort the table by uptime
  await t.click(serviceView.selectSort);
  await t.click(serviceView.optionSortStatus);

  // Verify the table is sorted by uptime, longest to shortest
  var currentUptime;
  var previousUptime;

  for (
    let instanceIndex = 0;
    instanceIndex < serviceView.instanceUptimes.count;
    instanceIndex++
  ) {
    if (instanceIndex === 0) {
      previousUptime = parseUptimeSeconds(
        await serviceView.instanceUptimes.nth(instanceIndex).textContent
      );
    } else {
      currentUptime = parseUptimeSeconds(
        await serviceView.instanceUptimes.nth(instanceIndex).textContent
      );
      await t.expect(currentUptime).lt(previousUptime);
      previousUptime = currentUptime;
    }
  }

  // Sort the table by uptime again
  await t.click(serviceView.selectSort);
  await t.click(serviceView.optionSortStatus);

  // Verify the table is sorted by uptime, shortest to longest
  for (
    let instanceIndex = 0;
    instanceIndex < serviceView.instanceUptimes.count;
    instanceIndex++
  ) {
    if (instanceIndex === 0) {
      previousUptime = parseUptimeSeconds(
        await serviceView.instanceUptimes.nth(instanceIndex).textContent
      );
    } else {
      currentUptime = parseUptimeSeconds(
        await serviceView.instanceUptimes.nth(instanceIndex).textContent
      );
      await t.expect(currentUptime).gt(previousUptime);
      previousUptime = currentUptime;
    }
  }

  // Sort the table by ID
  await t.click(serviceView.selectSort);
  await t.click(serviceView.optionSortName);

  // Verify the table is sorted in by ID in alphanumeric order
  var currentId;
  var previousId;

  for (
    var instanceIndex = 0;
    instanceIndex < serviceView.instanceIDs.count;
    instanceIndex++
  ) {
    if (instanceIndex === 0) {
      previousId = await serviceView.instanceIDs.nth(instanceIndex).textContent;
    } else {
      currentId = await serviceView.instanceIDs.nth(instanceIndex).textContent;
      await t.expect(currentId).gt(previousId);
      previousId = currentId;
    }
  }

  // Sort the table by ID again
  await t.click(serviceView.selectSort);
  await t.click(serviceView.optionSortName);

  // Verify the table is sorted by ID in reverse alphanumeric order
  for (
    let instanceIndex = 0;
    instanceIndex < serviceView.instanceIDs.count;
    instanceIndex++
  ) {
    if (instanceIndex === 0) {
      previousId = await serviceView.instanceIDs.nth(instanceIndex).textContent;
    } else {
      currentId = await serviceView.instanceIDs.nth(instanceIndex).textContent;
      await t.expect(currentId).lt(previousId);
      previousId = currentId;
    }
  }
});
