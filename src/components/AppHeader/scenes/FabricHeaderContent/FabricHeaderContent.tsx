import Tab from "components/AppHeader/components/Tab";
import TabNav from "components/AppHeader/components/TabNav";
import { useIntl } from "react-intl";
import { useAppSelector } from "store/hooks";
import { microserviceStatuses } from "utils/constants";
import { getStatusCount } from "utils/selectors";

/**
 * Fabric-level header tabs (All Services + status filters).
 */
function FabricAppHeaderContent() {
  const intl = useIntl();
  const statusCount = useAppSelector(getStatusCount);

  return (
    <TabNav>
      <Tab
        title={intl.formatMessage({
          id: "fabricHeaderContent.allServices",
          defaultMessage: "All Services",
          description: "Fabric view tab title"
        })}
        href="/"
        icon="Summary"
        lines={[
          {
            name: intl.formatMessage({
              id: "fabricHeaderContent.services",
              defaultMessage: "Services",
              description: "Fabric view tab detail"
            }),
            value: statusCount.total
          }
        ]}
      />
      {microserviceStatuses.map((status) => {
        return (
          <Tab
            title={intl.formatMessage({
              id: `fabricHeaderContent.${status.toLowerCase()}`,
              defaultMessage: `${status}`,
              description: "Fabric view tab title"
            })}
            href={`/${status}`}
            icon={status}
            lines={[
              {
                name: intl.formatMessage({
                  id: "fabricHeaderContent.services",
                  defaultMessage: "Services",
                  description: "Fabric view tab detail"
                }),
                value: statusCount[status as keyof typeof statusCount]
              }
            ]}
            key={status}
          />
        );
      })}
    </TabNav>
  );
}

export default FabricAppHeaderContent;
