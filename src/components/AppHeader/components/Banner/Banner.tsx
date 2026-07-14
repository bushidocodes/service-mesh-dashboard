import React, { Fragment } from "react";
import Extra from "./components/Extra";
import Header from "./components/Header";
import HeaderContainer from "./components/HeaderContainer";

interface BannerProps {
  extras?: any[];
  hideBackground?: boolean;
  title: string;
}

/**
 * Stateless functional React component that renders the banner in AppHeader
 * @param {String} props - See propTypes
 * @returns JSX.Element
 */
function Banner({ title, extras, hideBackground = false }: BannerProps) {
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
