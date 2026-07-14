import ServiceView from "components/Main/scenes/ServiceView";
import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { injectIntl } from "utils/injectIntl";
import { computeStatus } from "utils/selectors";

interface ServiceRouteElementInnerProps {
  intl: any;
  services?: Record<string, any>;
}

/**
 * Renders the service route content using useParams() to get selectedServiceSlug.
 *
 * Same intl.formatMessage() pattern as InstanceRouteElement — see comment
 * there for why <Navigate state> requires a plain string.
 */
function ServiceRouteElementInner({
  services,
  intl
}: ServiceRouteElementInnerProps) {
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
  const servicesAreNotLoaded = !Object.keys(services || {}).length;

  // Set our authorization booleans
  const userIsAuthorized = service.authorized;
  const serviceIsMetered = service.metered;
  const serviceIsValid =
    selectedServiceSlug !== undefined &&
    Object.keys(services || {}).includes(selectedServiceSlug);
  // Set a message to pass to location state if one of the following checks fail
  let message;
  // Checks are ordered by priority of the message
  if (!serviceIsValid) {
    message = intl.formatMessage(
      {
        id: "fabricRouter.noService",
        defaultMessage: "{serviceSlug} is not a known microservice",
        description: "Error notification"
      },
      { serviceSlug: selectedServiceSlug }
    );
  } else if (!userIsAuthorized) {
    message = intl.formatMessage(
      {
        id: "fabricRouter.notAuthorized",
        defaultMessage:
          "You are not authorized to view {serviceName} {serviceVersion}",
        description: "Error notification"
      },
      { serviceName: service.name, serviceVersion: service.version }
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

export default injectIntl(ServiceRouteElementInner);
