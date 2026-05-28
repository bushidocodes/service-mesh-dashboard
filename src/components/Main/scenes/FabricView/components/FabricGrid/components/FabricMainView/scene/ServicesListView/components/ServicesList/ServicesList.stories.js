import React from "react";

import GMServiceList from "./index.js";

// mock data for Section List View
const groupingByHeadingListViewMockData = [
  {
    headerTitle: "Grey Matter Services",
    name: "Awesome Service 1",
    instances: [
      {
        name: "ee0fa3669fea7e9a0adea649c46bca56",
        start_time: 1508854912461
      },
      {
        name: "8bedb4551e801f38bf149001a72a1127",
        start_time: 1508370483156
      },
      {
        name: "d9de3a9c26c6c84daaf1ceb40559d659",
        start_time: 1508170483156
      }
    ],
    version: "1.1",
    slug: "awesome-service-1-v1-1",
    key: "awesome-service-1-v1-1",
    docsLink: "http://www.deciphernow.com",
    authorized: true,
    runtime: "GO",
    status: "Stable"
  },
  {
    headerTitle: "MEME Services",
    name: "Awesome Service 2",
    instances: [
      {
        name: "ee0fa3669fea7e9a0adea649c46bca56",
        start_time: 1508854912461
      },
      {
        name: "8bedb4551e801f38bf149001a72a1127",
        start_time: 1508370483156
      },
      {
        name: "d9de3a9c26c6c84daaf1ceb40559d659",
        start_time: 1508170483156
      }
    ],
    version: "1.5",
    slug: "awesome-service-2-v1-5",
    key: "awesome-service-2-v1-5",
    docsLink: "http://www.deciphernow.com",
    authorized: true,
    runtime: "GO",
    status: "Down"
  },
  {
    headerTitle: "Grey Matter Services",
    name: "Awesome Service 3",
    instances: [
      { name: "ee0fa3669fea7e9a0adea649c46bca56", start_time: 1508854912461 },
      { name: "8bedb4551e801f38bf149001a72a1127", start_time: 1508370483156 },
      { name: "d9de3a9c26c6c84daaf1ceb40559d659", start_time: 1508170483156 }
    ],
    version: "1.7",
    slug: "awesome-service-3-v1-7",
    key: "awesome-service-3-v1-7",
    docsLink: "http://www.deciphernow.com",
    authorized: true,
    runtime: "JVM",
    status: "Warning"
  },
  {
    headerTitle: "MEME Services",
    name: "Awesome Service 4",
    instances: [
      { name: "ee0fa3669fea7e9a0adea649c46bca56", start_time: 1508854912461 },
      { name: "8bedb4551e801f38bf149001a72a1127", start_time: 1508370483156 },
      { name: "d9de3a9c26c6c84daaf1ceb40559d659", start_time: 1508170483156 }
    ],
    version: "1.2",
    slug: "awesome-service-4-v1-2",
    key: "awesome-service-4-v1-2",
    docsLink: "http://www.deciphernow.com",
    authorized: true,
    runtime: "GO",
    status: "Stable"
  },
  {
    headerTitle: "Grey Matter Services",
    name: "Awesome Service 5",
    instances: [
      { name: "ee0fa3669fea7e9a0adea649c46bca56", start_time: 1508854912461 },
      { name: "8bedb4551e801f38bf149001a72a1127", start_time: 1508370483156 },
      { name: "d9de3a9c26c6c84daaf1ceb40559d659", start_time: 1508170483156 }
    ],
    version: "1.2",
    slug: "awesome-service-5-v1-2",
    key: "awesome-service-5-v1-2",
    docsLink: "http://www.deciphernow.com",
    authorized: true,
    runtime: "JVM",
    status: "Stable"
  },
  {
    headerTitle: "MEME Services",
    name: "Awesome Service 6",
    instances: [
      { name: "ee0fa3669fea7e9a0adea649c46bca56", start_time: 1508854912461 },
      { name: "8bedb4551e801f38bf149001a72a1127", start_time: 1508370483156 },
      { name: "d9de3a9c26c6c84daaf1ceb40559d659", start_time: 1508170483156 }
    ],
    version: "1.2",
    slug: "awesome-service-6-v1-2",
    key: "awesome-service-6-v1-2",
    docsLink: "http://www.deciphernow.com",
    authorized: true,
    runtime: "JVM",
    status: "Down"
  },
  {
    headerTitle: "Grey Matter Services",
    name: "Awesome Service 7",
    instances: [
      { name: "ee0fa3669fea7e9a0adea649c46bca56", start_time: 1508854912461 },
      { name: "8bedb4551e801f38bf149001a72a1127", start_time: 1508370483156 },
      { name: "d9de3a9c26c6c84daaf1ceb40559d659", start_time: 1508170483156 }
    ],
    version: "1.1",
    slug: "awesome-service-7-v1-1",
    key: "awesome-service-7-v1-1",
    docsLink: "http://www.deciphernow.com",
    authorized: true,
    runtime: "GO",
    status: "Down"
  },
  {
    headerTitle: "MEME Services",
    name: "Awesome Service 8",
    instances: [
      { name: "ee0fa3669fea7e9a0adea649c46bca56", start_time: 1508854912461 },
      { name: "8bedb4551e801f38bf149001a72a1127", start_time: 1508370483156 },
      { name: "d9de3a9c26c6c84daaf1ceb40559d659", start_time: 1508170483156 }
    ],
    version: "1.1",
    slug: "awesome-service-8-v1-1",
    key: "awesome-service-8-v1-1",
    docsLink: "http://www.deciphernow.com",
    authorized: true,
    runtime: "JVM",
    status: "Stable"
  },
  {
    headerTitle: "MEME Services",
    name: "Awesome Service 9",
    instances: [
      { name: "ee0fa3669fea7e9a0adea649c46bca56", start_time: 1508854912461 },
      { name: "8bedb4551e801f38bf149001a72a1127", start_time: 1508370483156 },
      { name: "d9de3a9c26c6c84daaf1ceb40559d659", start_time: 1508170483156 }
    ],
    version: "1.1",
    slug: "awesome-service-9-v1-1",
    key: "awesome-service-9-v1-1",
    docsLink: "http://www.deciphernow.com",
    authorized: true,
    runtime: "JVM",
    status: "Stable"
  },
  {
    headerTitle: "Grey Matter Services",
    name: "Awesome Service 10",
    instances: [
      { name: "ee0fa3669fea7e9a0adea649c46bca56", start_time: 1508854912461 },
      { name: "8bedb4551e801f38bf149001a72a1127", start_time: 1508370483156 },
      { name: "d9de3a9c26c6c84daaf1ceb40559d659", start_time: 1508170483156 }
    ],
    version: "1.1",
    slug: "awesome-service-10-v1-1",
    key: "awesome-service-10-v1-1",
    docsLink: "http://www.deciphernow.com",
    authorized: true,
    runtime: "GO",
    status: "Down"
  },
  {
    headerTitle: "MEME Services",
    instances: [
      { name: "ee0fa3669fea7e9a0adea649c46bca56", start_time: 1508854912461 },
      { name: "8bedb4551e801f38bf149001a72a1127", start_time: 1508370483156 },
      { name: "d9de3a9c26c6c84daaf1ceb40559d659", start_time: 1508170483156 }
    ],
    name: "Awesome Service 11",
    version: "1.1",
    slug: "awesome-service-11-v1-1",
    key: "awesome-service-11-v1-1",
    docsLink: "http://www.deciphernow.com",
    authorized: true,
    runtime: "GO",
    status: "Warning"
  }
];
const singleGroupingByHeadingListViewMockData =
  groupingByHeadingListViewMockData.filter(
    (elem) => elem.headerTitle === "MEME Services"
  );

export default {
  title: "Service List Collection",
  component: GMServiceList
};

export const WithAGroupingHeaderAndGroupOfLists = {
  render: () => (
    <GMServiceList items={singleGroupingByHeadingListViewMockData} />
  )
};

export const WithMultipleGroupingHeadersAndGroupsOfLists = {
  render: () => <GMServiceList items={groupingByHeadingListViewMockData} />
};
