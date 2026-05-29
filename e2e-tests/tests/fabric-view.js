import _ from "lodash";
import { waitForReact } from "testcafe-react-selectors";

import FabricViewModel from "../view-models/fabric-view-model";

fixture`Fabric View`.page`http://localhost:3000/`.beforeEach(async () => {
  await waitForReact();
});

const fabricView = new FabricViewModel();
const defaultTimeout = 30; // Number of seconds to wait before giving up repeated attempts

test("Validate Service Counts", async (t) => {
  // Check that there are an equal amount of cards as list items
  let attempts = 0;
  let allServicesCardsCount = 0;
  let allServicesListCount = 0;

  while (allServicesCardsCount === 0 && attempts < defaultTimeout) {
    allServicesCardsCount = await fabricView.servicesCards.count;
    await t.wait(1000);
    attempts++;
  }

  await t.click(fabricView.linkList).wait(1000);

  while (allServicesListCount === 0 && attempts < defaultTimeout) {
    allServicesListCount = await fabricView.servicesList.count;
    await t.wait(1000);
    attempts++;
  }

  await t
    .expect(allServicesCardsCount)
    .eql(allServicesListCount, "All Services count matches");

  await t.click(fabricView.linkCards).wait(1000);

  // Count all services and make sure the count matches what's shown in the All Services tab
  attempts = 0;
  allServicesCardsCount = 0;

  while (allServicesCardsCount === 0 && attempts < defaultTimeout) {
    allServicesCardsCount = await fabricView.servicesCards.count;
    await t.wait(1000);
    attempts++;
  }

  const allServicesTabCount = parseInt(
    await fabricView.textAllServicesCount.textContent,
    10
  );

  await t
    .expect(allServicesCardsCount)
    .eql(allServicesTabCount, "All Services count matches");

  // Navigate to the Down tab
  await t.click(fabricView.linkDown);

  // Count down services and make sure the count matches what's shown in the Down tab
  attempts = 0;
  let downServicesCardsCount = 0;

  while (downServicesCardsCount === 0 && attempts < defaultTimeout) {
    downServicesCardsCount = await fabricView.servicesCards.count;
    await t.wait(1000);
    attempts++;
  }

  const downServicesTabCount = parseInt(
    await fabricView.textDownCount.textContent,
    10
  );

  await t
    .expect(downServicesCardsCount)
    .eql(downServicesTabCount, "Down services count matches");

  // Navigate to the Warning tab
  await t.click(fabricView.linkWarning);

  // Count the warning services and make sure the count matches what's shown in the Warning tab
  attempts = 0;
  let warningServicesCardsCount = 0;

  while (warningServicesCardsCount === 0 && attempts < defaultTimeout) {
    warningServicesCardsCount = await fabricView.servicesCards.count;
    await t.wait(1000);
    attempts++;
  }

  const warningServicesTabCount = parseInt(
    await fabricView.textWarningCount.textContent,
    10
  );

  await t
    .expect(warningServicesCardsCount)
    .eql(warningServicesTabCount, "Warning services count matches");

  // Navigate to the Stable tab
  await t.click(fabricView.linkStable);

  // Count the stable services and make sure the count matches what's shown in the Stable tab
  attempts = 0;
  var stableServicesCardsCount = 0;

  while (stableServicesCardsCount === 0 && attempts < defaultTimeout) {
    stableServicesCardsCount = await fabricView.servicesCards.count;
    await t.wait(1000);
    attempts++;
  }

  const stableServicesTabCount = parseInt(
    await fabricView.textStableCount.textContent,
    10
  );

  await t
    .expect(stableServicesCardsCount)
    .eql(stableServicesTabCount, "Stable service count matches");
});

test("Validate Filtering: Search", async (t) => {
  let allServicesCardsCount = 0,
    initialServiceCardCount = 0,
    attempts = 0;

  // Get the initial count so that we can test against it later
  while (initialServiceCardCount === 0 && attempts < defaultTimeout) {
    initialServiceCardCount = await fabricView.servicesCards.count;
    await t.wait(1000);
    attempts++;
  }

  attempts = 0;

  // Grab a substring of the first service card name and use that as our search string
  let searchString = await fabricView.servicesCards.nth(-1).find("a").innerText;

  // If a service name is too long it will be truncated with a  "...", so we need to slice it off so that it doesn't break our search
  if (searchString.indexOf("...") > 0) {
    searchString = searchString.slice(0, -4).toLowerCase();
  } else {
    searchString = searchString.toLowerCase();
  }

  await t
    .typeText(fabricView.inputSearchServices, searchString, { paste: true })
    .wait(2000);

  while (allServicesCardsCount === 0 && attempts < defaultTimeout) {
    allServicesCardsCount = await fabricView.servicesCards.count;
    await t.wait(1000);
    attempts++;
  }

  // Loop through all the services and make sure they contain the search string
  for (let i = 0; i < allServicesCardsCount; i++) {
    await t
      .expect(
        await fabricView.servicesCards
          .nth(i)
          .innerText.then((text) => text.toLowerCase())
      )
      .contains(searchString, "No service cards contain the search string");
  }

  allServicesCardsCount = 0;
  attempts = 0;

  // Clear the search and type nonsense to verify that no services appear
  await t.click(fabricView.inputSearchServices).pressKey("ctrl+a delete");
  await t.typeText(fabricView.inputSearchServices, "bananagrams");

  // Service card count should equal 0, so just wait 5 sec
  while (attempts < 5) {
    allServicesCardsCount = await fabricView.servicesCards.count;
    await t.wait(1000);
    attempts++;
  }

  await t
    .expect(allServicesCardsCount)
    .eql(0, "Service card count does not equal 0");

  // Clear the input field
  await t.click(fabricView.inputSearchServices).pressKey("ctrl+a delete");

  allServicesCardsCount = 0;
  attempts = 0;

  while (allServicesCardsCount === 0 && attempts < defaultTimeout) {
    allServicesCardsCount = await fabricView.servicesCards.count;
    await t.wait(1000);
    attempts++;
  }

  // Once the search box is cleared, all service cards should be present again
  await t
    .expect(allServicesCardsCount)
    .eql(
      initialServiceCardCount,
      "The number of service cards does not equal the initial service card count."
    );
});

test("Validate Filtering: Grouping", async (t) => {
  /*/  Group by Owner /*/

  await t.click(fabricView.selectGroup).click(fabricView.optionGroupOwner);

  // Grab all services from FabricMainView props
  const allServicesFromProps = await fabricView.servicesGrid.getReact();

  // Get names of all unique owners
  const allOwners = await _.uniq(
    allServicesFromProps.props.services.map((service) => service.owner)
  );
  let servicesSectionsCount = await fabricView.servicesSections.count;

  await t
    .expect(allOwners.length)
    .eql(
      servicesSectionsCount,
      "The number of owners does not match the number of sections"
    );

  // Loop through the service headers and check that they are all rendered with the appropriate text
  for (let i = 0; i < allOwners.length; i++) {
    await t
      .expect(
        await fabricView.servicesHeaders
          .nth(i)
          .innerText.then((text) => text.toLowerCase())
      )
      .contains(allOwners[i].toLowerCase());
  }

  /*/  Group by Capability /*/

  await t.click(fabricView.selectGroup).click(fabricView.optionGroupCapability);

  const allCapabilites = await _.uniq(
    allServicesFromProps.props.services.map((service) => service.capability)
  );
  servicesSectionsCount = await fabricView.servicesSections.count;

  await t
    .expect(allCapabilites.length)
    .eql(
      servicesSectionsCount,
      "The number of capabilities does not match the number of sections"
    );

  // Loop through the service headers and check that they are all rendered with the appropriate text
  for (let i = 0; i < allCapabilites.length; i++) {
    await t
      .expect(
        await fabricView.servicesHeaders
          .nth(i)
          .innerText.then((text) => text.toLowerCase())
      )
      .contains(allCapabilites[i].toLowerCase());
  }

  /*/  Group by Status /*/
  await t.click(fabricView.selectGroup).click(fabricView.optionGroupStatus);

  servicesSectionsCount = await fabricView.servicesSections.count;
  const allStatuses = ["down", "warning", "stable"];

  await t
    .expect(allStatuses.length)
    .eql(
      servicesSectionsCount,
      "The number of capabilities does not match the number of sections"
    );

  // Loop through the service headers and check that they are all rendered with the appropriate text
  for (let i = 0; i < allStatuses.length; i++) {
    await t
      .expect(
        await fabricView.servicesHeaders
          .nth(i)
          .innerText.then((text) => text.toLowerCase())
      )
      .contains(allStatuses[i].toLowerCase());
  }

  /*/ Group by None /*/
  await t.click(fabricView.selectGroup).click(fabricView.optionGroupNone);

  servicesSectionsCount = await fabricView.servicesSections.count;
  const sectionsHeaderCount = await fabricView.servicesHeaders.count;

  await t
    .expect(servicesSectionsCount)
    .eql(1, "The number of sections is not 1");
  await t.expect(sectionsHeaderCount).eql(0, "The number of headers is not 0");
});

test("Validate Filtering: Sorting", async (t) => {
  /*/ Sort by Status /*/
  // First group by none so we can easily see the effects of sorting
  await t.click(fabricView.selectGroup).click(fabricView.optionGroupNone);
  await t.click(fabricView.selectSort).click(fabricView.optionSortStatus);

  // Add a custom property that computes the index of an element in the grid.
  const serviceCardsWithIndices =
    fabricView.servicesCards.addCustomDOMProperties({
      indexInGrid: (el) => {
        const nodes = Array.prototype.slice.call(el.parentElement.children);
        return nodes.indexOf(el);
      }
    });

  // Get the positions of the first/last cards of each type
  const indexOfLastDownCard = await serviceCardsWithIndices
    .withAttribute("name", "Down")
    .nth(-1).indexInGrid;
  const indexOfFirstWarningCard = await serviceCardsWithIndices
    .withAttribute("name", "Warning")
    .nth(0).indexInGrid;
  const indexOfLastWarningCard = await serviceCardsWithIndices
    .withAttribute("name", "Warning")
    .nth(-1).indexInGrid;
  const indexOfFirstStableCard = await serviceCardsWithIndices
    .withAttribute("name", "Stable")
    .nth(0).indexInGrid;

  await t.expect(indexOfLastDownCard).lt(indexOfFirstWarningCard);
  await t.expect(indexOfLastWarningCard).lt(indexOfFirstStableCard);

  /*/ Sort by Name /*/
  await t.click(fabricView.selectSort).click(fabricView.optionSortName);
  const allServicesCardsCount = await fabricView.servicesCards.count;

  // Loop through the service cards and check that they are rendered in alphabetical order
  for (let i = 0; i < allServicesCardsCount; i++) {
    if (i !== allServicesCardsCount - 1) {
      const currentServiceName = await fabricView.servicesCards
        .nth(i)
        .innerText.then((text) => text.toLowerCase());
      const nextServiceName = await fabricView.servicesCards
        .nth(i + 1)
        .innerText.then((text) => text.toLowerCase());
      // TestCafe 3.x assertions (.lte/.gte/.lt/.gt) require numbers/dates;
      // do the lexicographic comparison in JS and assert the boolean result.
      await t
        .expect(currentServiceName <= nextServiceName)
        .ok(
          `Service cards not sorted alphabetically: "${currentServiceName}" should sort before "${nextServiceName}"`
        );
    }
  }
});
