import React from "react";
import SectionItems from "./components/SectionItems";
import ServicesListItem from "./components/ServicesListItem";

/**
 * Render section(s) with grouping header and group of lists
 *
 */

interface ServicesListProps {
  groupByAttribute?: string;
  items: any[];
}

export default function ServicesList({
  items,
  groupByAttribute
}: ServicesListProps) {
  return (
    <SectionItems>
      {items.map((item) => (
        <ServicesListItem
          authorized={item.authorized}
          metered={item.metered}
          key={item.slug}
          instances={item.instances}
          name={item.name}
          runtime={item.runtime}
          slug={item.slug}
          status={item.status}
          version={item.version}
          docsLink={item.docsLink}
          groupByAttribute={groupByAttribute}
        />
      ))}
    </SectionItems>
  );
}
