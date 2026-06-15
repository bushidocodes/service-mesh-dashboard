import styled from "styled-components";

import { spacingScale } from "style/styleFunctions";

const APP_TOOLBAR_HEIGHT = spacingScale(4.25);
const APP_TOOLBAR_BRAND_SPACING = spacingScale(0.25);
const MAX_BRANDLOGO_HEIGHT = Math.round(
  (parseInt(APP_TOOLBAR_HEIGHT, 10) - parseInt(APP_TOOLBAR_BRAND_SPACING, 10)) /
    2
);

const BrandLogo = styled.img`
  margin: 0 ${spacingScale(1)};
  max-height: ${MAX_BRANDLOGO_HEIGHT}px;
  width: auto;
`;

export default BrandLogo;
