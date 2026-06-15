import React from "react";
import styled from "styled-components";
import GMServiceCard from "./components/GMServiceCard";

interface GMServiceCardCollectionProps {
  items: any[];
}

const ContentItems = styled.div`
  display: flex;
  flex-flow: row wrap;
  flex-basis: 100%;
`;

/**
 * Render section(s) with grouping header and group of cards
 *
 */

export default function GMServiceCardCollection({
  items
}: GMServiceCardCollectionProps) {
  return (
    <ContentItems>
      {items.map((item) => (
        <GMServiceCard
          authorized={item.authorized}
          key={item.slug}
          name={item.name}
          slug={item.slug}
          version={item.version}
          docsLink={item.docsLink}
          status={item.status}
          metered={item.metered}
          runtime={item.runtime}
        />
      ))}
    </ContentItems>
  );
}
