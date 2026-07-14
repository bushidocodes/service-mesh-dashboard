import React from "react";
import { slugifyMicroservice } from "utils";
import GMServiceListItem from "./index";

export default {
  title: "Service List Item",
  component: GMServiceListItem
};

export const Default = {
  render: () => {
    const name = "Service";
    const version = "1.1";
    return (
      <GMServiceListItem
        name={name}
        runtime="JVM"
        instances={[
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
        ]}
        version={version}
        slug={slugifyMicroservice(name, version)}
        status="Stable"
        authorized={true}
        metered={true}
        docsLink="#"
      />
    );
  }
};

export const ListOfServiceListItems = {
  render: () => (
    <ul>
      <GMServiceListItem
        name="Awesome Service"
        instances={[
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
        ]}
        version="1.1"
        slug="awesome-service-v1-1"
        docsLink="http://www.deciphernow.com"
        runtime="JVM"
        metered={true}
        status="Stable"
      />
      <GMServiceListItem
        name="Awesome Service 2"
        instances={[
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
        ]}
        version="1.0"
        slug="awesome-service-2-v1-0"
        docsLink="http://www.deciphernow.com"
        runtime="JVM"
        metered={true}
        status="Down"
      />
      <GMServiceListItem
        name="Awesome Service 3"
        instances={[
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
        ]}
        version="1.1"
        slug="awesome-service-3-v1-1"
        docsLink="http://www.deciphernow.com"
        runtime="GO"
        metered={true}
        status="Warning"
      />
      <GMServiceListItem
        name="Awesome Service 4"
        instances={[
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
        ]}
        version="3.1"
        slug="awesome-service-4-v3-1"
        docsLink="http://www.deciphernow.com"
        status="Stable"
        metered={true}
        runtime="GO"
      />
    </ul>
  )
};
