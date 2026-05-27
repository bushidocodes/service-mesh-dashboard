import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";

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

/**
 * Renders the instance route content using useParams() to get serviceSlug and instanceID.
 */
function InstanceRouteElement({ services }) {
  const { serviceSlug, instanceID } = useParams();

  const service = services && serviceSlug ? services[serviceSlug] : false;

  // Lookup the runtime of the microservice named serviceSlug
  const runtime = service ? service.runtime : "";

  // Check if our services object has been passed to the router
  const servicesAreNotLoaded = !Object.keys(services).length;

  // Set a message to pass to location state if one of the following checks fail
  let message,
    pathname = "/";

  // Checks are ordered by priority of the message
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
    } else if (
      // Check if the user is authorized to view the service
      service &&
      !service.authorized
    ) {
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
      // Check our instanceID against this services' instances
      service &&
      !service.instances.some((obj) => {
        return obj.name === instanceID;
      })
    ) {
      // If isValidInstance is false, also set a pathname that will redirect to the service view
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

  return servicesAreNotLoaded || !message ? (
    <InstanceRouter
      runtime={runtime}
      serviceSlug={serviceSlug}
      instanceID={instanceID}
    />
  ) : (
    <Navigate to={pathname} state={{ message }} />
  );
}

InstanceRouteElement.propTypes = {
  services: PropTypes.object
};

/**
 * Renders the service route content using useParams() to get selectedServiceSlug.
 */
function ServiceRouteElement({ services }) {
  const { selectedServiceSlug } = useParams();

  if (selectedServiceSlug === "settings") {
    return null;
  }

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
  // Check if our services object has been passed to the router
  const servicesAreNotLoaded = !Object.keys(services).length;

  // Set our authorization booleans
  const userIsAuthorized = service.authorized;
  const serviceIsMetered = service.metered;
  const serviceIsValid = _.includes(Object.keys(services), selectedServiceSlug);
  // Set a message to pass to location state if one of the following checks fail
  let message;
  // Checks are ordered by priority of the message
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

  // If the services object has not been passed to the router yet,
  // or if the user is authorized and the service exists and is metered
  // then render the instance router, else redirect with error message
  return servicesAreNotLoaded || (userIsAuthorized && serviceIsValid) ? (
    <ServiceView
      instances={instances}
      selectedServiceSlug={selectedServiceSlug}
      serviceIsMetered={serviceIsMetered}
      status={status}
    />
  ) : (
    <Navigate to="/" state={{ message }} />
  );
}

ServiceRouteElement.propTypes = {
  services: PropTypes.object
};

/**
 * Fabric Router is a top-level router that sits between the root container and the Instance Router
 * that injects the following additional route parameters
 *
 * serviceSlug - The slug of the selected microservice
 * instanceID - The ID of the selected microservice instance of the service with the slug serviceSlug
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

      {/* Utility function that generates Routes for /down, /warning, and /stable */}
      {generateStatusRoutes(services)}

      <Route
        path="/:selectedServiceSlug"
        element={<ServiceRouteElement services={services} />}
      />
      {/* For the root route, mount the Fabric Grid, the element used to depict an entire Fabric of microservices*/}
      <Route path="/" element={<FabricGrid services={_.values(services)} />} />
    </Routes>
  );
}

function mapStateToProps(state) {
  return { services: state.fabric.services };
}

export default connect(mapStateToProps)(FabricRouter);
