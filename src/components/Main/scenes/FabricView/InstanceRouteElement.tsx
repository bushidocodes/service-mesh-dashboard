import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { injectIntl } from "utils/injectIntl";

import { LazyLoader } from "components/LazyLoader";

import type { ServiceInstance } from "types";

const InstanceRouter = LazyLoader({
  loader: () => import("components/Main/scenes/InstanceView")
});

interface InstanceRouteElementInnerProps {
  intl: any;
  services?: Record<string, any>;
}

/**
 * Renders the instance route content using useParams() to get serviceSlug and instanceID.
 *
 * `message` must be a **plain string** when passed in <Navigate state>.
 * react-router pushes state through the browser History API, which uses the
 * structured-clone algorithm — that algorithm cannot clone React elements
 * (Symbol(react.element)), so a <FormattedMessage/> in state throws a
 * DataCloneError. Pre-format with intl.formatMessage() instead.
 */
function InstanceRouteElementInner({
  services,
  intl
}: InstanceRouteElementInnerProps) {
  const { serviceSlug, instanceID } = useParams();

  const service = services && serviceSlug ? services[serviceSlug] : false;

  // Lookup the runtime of the microservice named serviceSlug
  const runtime = service ? service.runtime : "";

  // Check if our services object has been passed to the router
  const servicesAreNotLoaded = !Object.keys(services || {}).length;

  // Set a message to pass to location state if one of the following checks fail
  let message,
    pathname = "/";

  // Checks are ordered by priority of the message
  if (!servicesAreNotLoaded) {
    if (!service) {
      message = intl.formatMessage(
        {
          id: "fabricRouter.noService",
          defaultMessage: "{serviceSlug} is not a known microservice",
          description: "Error notification"
        },
        { serviceSlug }
      );
    } else if (
      // Check if the user is authorized to view the service
      service &&
      !service.authorized
    ) {
      message = intl.formatMessage(
        {
          id: "fabricRouter.notAuthorized",
          defaultMessage:
            "You are not authorized to view {serviceName} {serviceVersion}",
          description: "Error notification"
        },
        { serviceName: service.name, serviceVersion: service.version }
      );
    } else if (
      // Check our instanceID against this services' instances
      service &&
      !service.instances.some((obj: ServiceInstance) => {
        return obj.name === instanceID;
      })
    ) {
      // If isValidInstance is false, also set a pathname that will redirect to the service view
      message = intl.formatMessage(
        {
          id: "fabricRouter.noInstance",
          defaultMessage:
            "{instanceID} is not a known instance of {serviceName} {serviceVersion}",
          description: "Error notification"
        },
        {
          serviceName: service.name,
          serviceVersion: service.version,
          instanceID
        }
      );
      pathname = `/${serviceSlug}`;
    } else if (!service.metered) {
      message = intl.formatMessage(
        {
          id: "fabricRouter.noMetrics",
          defaultMessage:
            "{serviceName} {serviceVersion} does not have metrics to display",
          description: "Error notification"
        },
        { serviceName: service.name, serviceVersion: service.version }
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

export default injectIntl(InstanceRouteElementInner);
