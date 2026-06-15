import React from "react";

import { slugifyMicroservice } from "utils";

import GMServiceCard from "./index";

export default {
  title: "Service Card",
  component: GMServiceCard
};

export const Default = {
  render: () => {
    const name = "Service Name";
    const version = "1.0";
    return (
      <GMServiceCard
        name={name}
        slug={slugifyMicroservice(name, version)}
        height={undefined}
        width={undefined}
        runtime="JVM"
        metered={true}
        version={version}
        status="Stable"
        authorized={true}
        docsLink="#"
      />
    );
  }
};

export const ServicesGrid = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "row", height: "150px" }}>
      <GMServiceCard
        name="Service 1"
        metered={true}
        runtime="JVM"
        version="3.1"
        slug="service-1-v3-1"
        docsLink="http://www.deciphernow.com"
        status="Stable"
      />
      <GMServiceCard
        name="Service 2"
        metered={true}
        runtime="GO"
        version="1.1"
        slug="service-2-v1-1"
        docsLink="http://www.deciphernow.com"
        status="Stable"
      />
      <GMServiceCard
        name="Service 3"
        metered={true}
        runtime="JVM"
        version="1.0"
        slug="service-3-v1-0"
        docsLink="http://www.deciphernow.com"
        status="Down"
      />
      <GMServiceCard
        name="Service 4"
        metered={true}
        runtime="GO"
        version="1.1"
        slug="service-4-v1-1"
        docsLink="http://www.deciphernow.com"
        status="Warning"
      />
      <GMServiceCard
        name="Service 1"
        metered={true}
        runtime="GO"
        version="3.1"
        slug="service-1-v3-1"
        docsLink="http://www.deciphernow.com"
        status="Stable"
      />
      <GMServiceCard
        name="Service 2"
        metered={true}
        runtime="JVM"
        version="1.1"
        slug="service-2-v1-1"
        docsLink="http://www.deciphernow.com"
        status="Stable"
      />
      <GMServiceCard
        name="Service 3"
        metered={true}
        runtime="GO"
        version="1.0"
        slug="service-3-v1-0"
        docsLink="http://www.deciphernow.com"
        status="Down"
      />
      <GMServiceCard
        name="Service 4"
        metered={true}
        runtime="JVM"
        version="1.1"
        slug="service-4-v1-1"
        docsLink="http://www.deciphernow.com"
        status="Warning"
      />
    </div>
  )
};
