import GMServiceCardCollection from "./index";

// mock data for Section Cards View
const groupingByStatusCardsViewMockData = [
  {
    headerTitle: "Stable",
    name: "Awesome Service 1",
    version: "1.1",
    slug: "awesome-service-1-v1-1",
    docsLink: "http://www.deciphernow.com",
    authorized: true,
    status: "Stable"
  },
  {
    headerTitle: "Down",
    name: "Awesome Service 2",
    version: "1.5",
    slug: "awesome-service-2-v1-5",
    docsLink: "http://www.deciphernow.com",
    authorized: true,
    status: "Down"
  },
  {
    headerTitle: "Warning",
    name: "Awesome Service 3",
    version: "1.7",
    slug: "awesome-service-3-v1-7",
    docsLink: "http://www.deciphernow.com",
    authorized: true,
    status: "Warning"
  },
  {
    headerTitle: "Stable",
    name: "Awesome Service 4",
    version: "1.2",
    slug: "awesome-service-4-v1-2",
    docsLink: "http://www.deciphernow.com",
    authorized: true,
    status: "Stable"
  },
  {
    headerTitle: "Stable",
    name: "Awesome Service 5",
    version: "1.2",
    slug: "awesome-service-5-v1-2",
    docsLink: "http://www.deciphernow.com",
    authorized: true,
    status: "Stable"
  },
  {
    headerTitle: "Down",
    name: "Awesome Service 6",
    version: "1.2",
    slug: "awesome-service-6-v1-2",
    docsLink: "http://www.deciphernow.com",
    authorized: true,
    status: "Down"
  },
  {
    headerTitle: "Down",
    name: "Awesome Service 7",
    version: "1.1",
    slug: "awesome-service-7-v1-1",
    docsLink: "http://www.deciphernow.com",
    authorized: true,
    status: "Down"
  },
  {
    headerTitle: "Stable",
    name: "Awesome Service 8",
    version: "1.1",
    slug: "awesome-service-8-v1-1",
    docsLink: "http://www.deciphernow.com",
    authorized: true,
    status: "Stable"
  },
  {
    headerTitle: "Stable",
    name: "Awesome Service 9",
    version: "1.1",
    slug: "awesome-service-9-v1-1",
    docsLink: "http://www.deciphernow.com",
    authorized: true,
    status: "Stable"
  },
  {
    headerTitle: "Down",
    name: "Awesome Service 10",
    version: "1.1",
    slug: "awesome-service-10-v1-1",
    docsLink: "http://www.deciphernow.com",
    authorized: true,
    status: "Down"
  },
  {
    headerTitle: "Warning",
    name: "Awesome Service 11",
    version: "1.1",
    slug: "awesome-service-11-v1-1",
    docsLink: "http://www.deciphernow.com",
    authorized: true,
    status: "Warning"
  }
];
const singleGroupingByStatusCardsViewMockData =
  groupingByStatusCardsViewMockData.filter(
    (elem) => elem.headerTitle === "Warning"
  );

export default {
  title: "Service Cards Collection",
  component: GMServiceCardCollection
};

export const WithASingleGroupingHeaderAndGroupOfCards = {
  render: () => (
    <GMServiceCardCollection items={singleGroupingByStatusCardsViewMockData} />
  )
};

export const WithMultipleGroupingHeadersAndGroupsOfCards = {
  render: () => (
    <GMServiceCardCollection items={groupingByStatusCardsViewMockData} />
  )
};
