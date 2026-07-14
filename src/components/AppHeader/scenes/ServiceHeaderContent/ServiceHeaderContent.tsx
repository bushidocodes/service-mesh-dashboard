import Tab from "components/AppHeader/components/Tab";
import TabNav from "components/AppHeader/components/TabNav";
import { useIntl } from "react-intl";
import { useLocation, useParams } from "react-router-dom";
import { useAppSelector } from "store/hooks";

/**
 * Service-level header tab showing instance count for the selected service.
 */
function ServiceHeaderContent() {
  const intl = useIntl();
  const { pathname } = useLocation();
  const { selectedServiceSlug } = useParams<{
    selectedServiceSlug?: string;
  }>();
  const services = useAppSelector((state) => state.fabric.services);
  const instanceCount =
    services &&
    selectedServiceSlug &&
    services[selectedServiceSlug] &&
    services[selectedServiceSlug].instances &&
    services[selectedServiceSlug].instances.length;

  return (
    <TabNav>
      <Tab
        title={intl.formatMessage({
          id: "serviceHeaderContent.instances",
          defaultMessage: "Instances",
          description: "Service view tab title"
        })}
        href={pathname}
        icon="Summary"
        lines={[
          {
            name: intl.formatMessage({
              id: "serviceHeaderContent.instances",
              defaultMessage: "Instances",
              description: "Service view tab detail"
            }),
            value: instanceCount || 0
          }
        ]}
      />
    </TabNav>
  );
}

export default ServiceHeaderContent;
