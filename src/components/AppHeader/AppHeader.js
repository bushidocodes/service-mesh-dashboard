import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import AppHeaderContainer from "./components/AppHeaderContainer";
import AppToolBar from "./components/AppToolBar";
import Banner from "./components/Banner";
import AppHeaderContent from "./scenes";

import { trimID } from "utils";
import { routerLocationShape } from "components/PropTypes";

AppHeader.propTypes = {
  location: routerLocationShape,
  services: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
};

/**
 * Stateless functional React component that renders the App Header
 * @returns JSX.Element
 */

function AppHeader({ location: { pathname }, title, services }) {
  return (
    <AppHeaderContainer>
      <AppToolBar pathname={pathname} serviceNameLookup={services} />
      <Banner title={title} hideBackground={false} />
      <AppHeaderContent />
    </AppHeaderContainer>
  );
}

function getTitle(pathArray, services) {
  // an instance ID will always be the second item in this array,
  // however the root can be a number of different things, including a service name slug
  const [root = "", selectedInstance = ""] = pathArray;

  // if the root is a valid service name slug, then use it to look up the real name and version
  const { name: selectedServiceName, version: selectedServiceVersion } =
    services[root] || "";

  if (selectedInstance) {
    return `${selectedServiceName} ${selectedServiceVersion}: ${trimID(
      selectedInstance
    )}`;
  } else if (selectedServiceName) {
    return `${selectedServiceName} ${selectedServiceVersion}`;
  } else if (root) {
    return root;
  } else {
    return "Fabric";
  }
}

function mapStateToProps(state, ownProps) {
  let pathArray = ownProps.location.pathname.replace(/^\/|\/$/g, "").split("/");
  return {
    title: getTitle(pathArray, state.fabric.services),
    services: state.fabric.services
  };
}

// We wrap with the withRouter HOC because we need to force this component to rerender on every route change
export default withRouter(connect(mapStateToProps)(AppHeader));
