import React from "react";

import Tab from "components/AppHeader/components/Tab";
import TabNav from "components/AppHeader/components/TabNav";

interface DefaultHeaderContentProps {
  basePath?: string;
  headerTabs?: any[];
  metrics?: Record<string, unknown>;
}

/**
 * Default Header Content
 * @export
 * @param {Object} props - See propTypes
 * @returns JSX.Element
 */
export default function DefaultHeaderContent({
  headerTabs
}: DefaultHeaderContentProps) {
  return (
    <TabNav>
      {headerTabs}
      <Tab href={`/explorer`} icon="Explorer" tabIndex={1} title="Explorer" />
    </TabNav>
  );
}
