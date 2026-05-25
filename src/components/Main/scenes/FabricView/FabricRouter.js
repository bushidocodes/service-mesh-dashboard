/* eslint-disable react/no-multi-comp */
import _ from "lodash";
import React from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import FabricGrid from "./components/FabricGrid";
import ServiceView from "components/Main/scenes/ServiceView";
import generateStatusRoutes from "./utils/generateStatusRoutes";
import { LazyLoader } from "components/LazyLoader";

import { computeStatus } from "utils/selectors";
import { serviceShape } from "components/PropTypes";

const InstanceRouter = LazyLoader({
  loader: () => import("components/Main/scenes/InstanceView")
});

const SettingsGrid = LazyLoader({
  loader: () => import("components/Main/components/Settings")
});

FabricRouter.propTypes = {
  services: serviceShape
};

InstanceRouteElement.propTypes = { services: serviceShape };

/**
 * Rendered as the element for /:serviceSlug/:instanceID/* routes.
 * Validates the service/instance combination and either renders the
 * InstanceRouter or redirects to the root with an error message.
 */
function InstanceRouteElement({ services }) {
  const { serviceSlug, instanceID } = useParams();

  const service = services && serviceSlug ? services[serviceSlug] : false;
  const runtime = service ? service.runtime : "";
  const servicesAreNotLoaded = !Object.keys(services).length;

  let message,
    pathname = "/";

  if (!servicesAreNotLoaded) {
    if (!service) {
      message = (
        <FormattedMessage
          id="fabricRouter.noService"
          defaultMessage="{serviceSlug} is not a known microservice"
          description="Error notification"
          values={{ serviceSlug }}
        />
      );
    } else if (service && !service.authorized) {
      message = (
        <FormattedMessage
          id="fabricRouter.notAuthorized"
          defaultMessage="You are not authorized to view {serviceName} {serviceVersion}"
          description="Error notification"
          values={{
            serviceName: service.name,
            serviceVersion: service.version
          }}
        />
      );
    } else if (
      service &&
      !service.instances.some((obj) => obj.name === instanceID)
    ) {
      message = (
        <FormattedMessage
          id="fabricRouter.noInstance"
          defaultMessage="{instanceID} is not a known instance of {serviceName} {serviceVersion}"
          description="Error notification"
          values={{
            serviceName: service.name,
            serviceVersion: service.version,
            instanceID
          }}
        />
      );
      pathname = `/${serviceSlug}`;
    } else if (!service.metered) {
      message = (
        <FormattedMessage
          id="fabricRouter.noMetrics"
          defaultMessage="{serviceName} {serviceVersion} does not have metrics to display"
          description="Error notification"
          values={{
            serviceName: service.name,
            serviceVersion: service.version
          }}
        />
      );
      pathname = `/${serviceSlug}`;
    }
  }

  if (!servicesAreNotLoaded && message) {
    return <Navigate replace to={{ pathname, state: { message } }} />;
  }

  return (
    <InstanceRouter
      runtime={runtime}
      serviceSlug={serviceSlug}
      instanceID={instanceID}
    />
  );
}

ServiceRouteElement.propTypes = { services: serviceShape };

/**
 * Rendered as the element for /:selectedServiceSlug routes.
 * Validates the service and either renders ServiceView or redirects with
 * an error message.
 */
function ServiceRouteElement({ services }) {
  const { selectedServiceSlug } = useParams();

  const service =
    services && selectedServiceSlug && services[selectedServiceSlug]
      ? services[selectedServiceSlug]
      : {};
  const instances = (service && service.instances) || [];
  const status = computeStatus(
    instances.length,
    service.minimum,
    service.maximum
  );
  const servicesAreNotLoaded = !Object.keys(services).length;
  const userIsAuthorized = service.authorized;
  const serviceIsMetered = service.metered;
  const serviceIsValid = _.includes(Object.keys(services), selectedServiceSlug);

  let message;

  if (!serviceIsValid) {
    message = (
      <FormattedMessage
        id="fabricRouter.noService"
        defaultMessage="{serviceSlug} is not a known microservice"
        description="Error notification"
        values={{ serviceSlug: selectedServiceSlug }}
      />
    );
  } else if (!userIsAuthorized) {
    message = (
      <FormattedMessage
        id="fabricRouter.notAuthorized"
        defaultMessage="You are not authorized to view {serviceName} {serviceVersion}"
        description="Error notification"
        values={{
          serviceName: service.name,
          serviceVersion: service.version
        }}
      />
    );
  }

  if (!servicesAreNotLoaded && message) {
    return <Navigate replace to={{ pathname: "/", state: { message } }} />;
  }

  return (
    <ServiceView
      instances={instances}
      selectedServiceSlug={selectedServiceSlug}
      serviceIsMetered={serviceIsMetered}
      status={status}
    />
  );
}

/**
 * Fabric Router is a top-level router that sits between the root container
 * and the Instance Router. It routes on serviceSlug and instanceID, validates
 * access/metering, and redirects with error messages when checks fail.
 *
 * @export
 * @returns JSX.Element
 */
function FabricRouter({ services }) {
  return (
    <Routes>
      <Route path="/settings" element={<SettingsGrid />} />
      <Route
        path="/:serviceSlug/:instanceID/*"
        element={<InstanceRouteElement services={services} />}
      />
      {generateStatusRoutes(services)}
      <Route
        path="/:selectedServiceSlug"
        element={<ServiceRouteElement services={services} />}
      />
      <Route path="/" element={<FabricGrid services={_.values(services)} />} />
    </Routes>
  );
}

function mapStateToProps(state) {
  return { services: state.fabric.services };
}

// v6 Routes re-render automatically on location changes — withRouter no longer needed
export default connect(mapStateToProps)(FabricRouter);
