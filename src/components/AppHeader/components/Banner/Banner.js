import { PropTypes } from "prop-types";
import React, { Fragment } from "react";

import HeaderContainer from "./components/HeaderContainer";
import Header from "./components/Header";
import Extra from "./components/Extra";

Banner.propTypes = {
  extras: PropTypes.array,
  hideBackground: PropTypes.bool,
  title: PropTypes.string.isRequired
};

/**
 * Stateless functional React component that renders the banner in AppHeader
 * @param {String} props - See propTypes
 * @returns JSX.Element
 */
function Banner({ title, extras, hideBackground = false }) {
  return (
    <HeaderContainer hideBackground={hideBackground}>
      <Header>{title || "—"}</Header>
      {extras && (
        <Fragment>
          {extras.map((extra) => (
            <Extra href={extra.path} key={extra.title}>
              {extra.title}
            </Extra>
          ))}
        </Fragment>
      )}
    </HeaderContainer>
  );
}

export default Banner;
