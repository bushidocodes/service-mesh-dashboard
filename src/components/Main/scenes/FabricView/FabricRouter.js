import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Switch, Redirect, Route, withRouter } from "react-router";
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

/**
 * Fabric Router is a top-level router that sits between the root container and the Instance Router
 * that injects the following additional route parameters
 *
 * serviceSlug - The slug of the selected microservice
 * instanceID - The ID of the selected microservice instance of the service with the slug serviceSlug
 *
 * When routes match with a serviceSlug and an instanceID, Fabric Router triggers the async
 * JumpState Effect selectInstance, which clears the metrics store and initiates polling of
 * the metrics endpoint associated with this instance.
 *
 * It also looks up the runtime of the selected microservice and passes it as props to the InstanceRouter
 *
 * @export
 * @returns JSX.Element
 */
function FabricRouter({ services }) {
  return (
    <Switch>
      <Route component={SettingsGrid} exact path="/settings" />
      <Route
        path="/:serviceSlug/:instanceID/"
        render={({
          match: {
            url,
            params: { serviceSlug, instanceID }
          }
        }) => {
          const baseURL = url[url.length - 1] === "/" ? url.slice(0, -1) : url;

          const service =
            services && serviceSlug ? services[serviceSlug] : false;

          // Lookup the runtime of the microservice named serviceSlug
          // runtime informs the runtime-agnostic InstanceRouter which runtime router to render
          const runtime = service ? service.runtime : "";

          // Check if our services object has been passed to the router
          const servicesAreNotLoaded = !Object.keys(services).length;

          // Set a message to pass to location state if one of the following checks fail
          let message,
            pathname = "/";

          // Checks are ordered by priority of the message
          // Check if the services are loaded, but the service slug didn't match
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

          // If the services object has not been passed to the router yet,
          // or if the user is authorized and the service exists and is metered
          // as determined by the message not getting set above
          // then render the instance router, else redirect with error message
          return servicesAreNotLoaded || !message ? (
            <InstanceRouter
              runtime={runtime}
              baseURL={baseURL}
              serviceSlug={serviceSlug}
              instanceID={instanceID}
            />
          ) : (
            <Redirect
              to={{
                pathname: pathname,
                state: {
                  message
                }
              }}
            />
          );
        }}
      />

      {/* Utility function that generates Routes for /down, /warning, and /stable */}
      {generateStatusRoutes(services)}

      <Route
        exact
        path="/:selectedServiceSlug/"
        render={({
          location: { pathname },
          match: {
            params: { selectedServiceSlug }
          },
          ...props
        }) => {
          // Blacklist known top level routes in render just in case.
          // Since we're in a switch and this route is last, this shouldn't be needed
          if (pathname !== "/settings") {
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
            const serviceIsValid = _.includes(
              Object.keys(services),
              selectedServiceSlug
            );
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
            return servicesAreNotLoaded ||
              (userIsAuthorized && serviceIsValid) ? (
              <ServiceView
                instances={instances}
                selectedServiceSlug={selectedServiceSlug}
                serviceIsMetered={serviceIsMetered}
                status={status}
              />
            ) : (
              <Redirect
                to={{
                  pathname: "/",
                  state: { message }
                }}
              />
            );
          }
        }}
      />
      {/* For the route route, mount the Fabric Grid, the element used to depict an entire Fabric of microservices*/}
      <Route
        exact
        path="/"
        render={(props) => {
          return <FabricGrid {...props} services={_.values(services)} />;
        }}
      />
    </Switch>
  );
}

function mapStateToProps(state) {
  return { services: state.fabric.services };
}

// We wrap with the withRouter HOC because we need to force this component to rerender on every route change
export default withRouter(connect(mapStateToProps)(FabricRouter));
