import { FormattedMessage } from "react-intl";
import React from "react";
import Copyright from "./components/Copyright";
import Footer from "./components/Footer";
import LongLogo from "./components/LongLogo";
import Links from "./components/Links";
import Link from "./components/Link";
import Icon from "components/Icon";
import Glyph from "components/Glyphs";

import longLogo from "./assets/decipher-logo-long.png";

/**
 * Stateless functional React component that renders company branding and social media footer content
 * @returns JSX.Element
 */
export default function AppFooter() {
  return (
    <Footer>
      <LongLogo
        href="http://deciphernow.com"
        rel="noopener noreferrer"
        target="_blank"
        title="Decipher Technology Studios website"
      >
        <img alt="Decipher Technology Studios" src={longLogo} />
      </LongLogo>
      <Copyright>
        <FormattedMessage
          id="footer.copyright"
          defaultMessage="Copyright © 2018 Decipher Technology Studios. All rights reserved.{br}Copyright © 2018 Grey Matter, a Decipher Technology Studios product. All rights reserved."
          description="Footer copyright message"
          values={{ br: <br key="br" /> }}
        />
      </Copyright>
      <Links>
        <Link
          href="http://github.com/DecipherNow"
          rel="noopener noreferrer"
          target="_blank"
          title="Decipher Technology Studios Github"
        >
          <Icon iconRatio={0.8}>
            <Glyph name="GitHub" />
          </Icon>
        </Link>
        <Link
          href="http://twitter.com/deciphernow"
          rel="noopener noreferrer"
          target="_blank"
          title="Decipher Technology Studios Twitter"
        >
          <Icon iconRatio={0.8}>
            <Glyph name="Twitter" />
          </Icon>
        </Link>
        <Link
          href="http://www.linkedin.com/company/decipher-technology-studios"
          rel="noopener noreferrer"
          target="_blank"
          title="Decipher Technology Studios LinkedIn"
        >
          <Icon iconRatio={0.8}>
            <Glyph name="LinkedIn" />
          </Icon>
        </Link>
      </Links>
    </Footer>
  );
}
