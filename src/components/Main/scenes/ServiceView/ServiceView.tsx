import ErrorBoundary from "components/ErrorBoundary";
import NotFoundError from "components/Main/components/NotFoundError";
import Table from "components/Main/components/Table";
import TableToolbar from "components/Main/components/TableToolbar";
import { useUrlState } from "components/withUrlState";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import { reportError } from "services/notification";
import { Actions } from "store/jumpstate";
import type { ServiceInstance } from "types";
import { orderBy } from "utils/collections";

interface ServiceViewProps {
  instances: ServiceInstance[];
  selectedServiceSlug?: string;
  serviceIsMetered?: boolean;
  status: string;
}

function ServiceView({
  instances,
  selectedServiceSlug,
  serviceIsMetered,
  status
}: ServiceViewProps) {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();
  const { urlState, setUrlState } = useUrlState();

  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only; mirrors former componentDidMount (one-shot location message)
  useEffect(() => {
    const locationState = location.state as { message?: string } | null;
    if (locationState && locationState.message) {
      // Disable polling and clear metrics cache
      Actions.stopPollingAndPurgeInstanceMetrics();
      // Display notification
      reportError(locationState.message);
      // Reset location state. Defer past the current commit: componentDidMount
      // runs in React's layout phase, before React Router's passive effect marks
      // navigation as active, so calling navigate()/history.replace() here
      // synchronously triggers a "You should call navigate() in a
      // React.useEffect()" warning. A setTimeout(0) runs after the passive
      // effects have flushed, when navigation is ready.
      setTimeout(() => navigate(".", { replace: true, state: {} }), 0);
    }
  }, []);

  const {
    filterString = "",
    sortByAttribute = "name",
    ascending = "true"
  } = urlState;

  const setSortByAttribute = (newSortByAttribute: string) => {
    if (sortByAttribute === newSortByAttribute) {
      setUrlState({ ascending: !JSON.parse(ascending) });
    } else {
      setUrlState({ sortByAttribute: newSortByAttribute });
    }
  };

  const sortOrder: ("asc" | "desc")[] = JSON.parse(ascending)
    ? ["asc"]
    : ["desc"];

  return instances && instances.length ? (
    <div>
      <TableToolbar
        searchInputProps={{
          filterString,
          setFilterString: (filterString) => setUrlState({ filterString }),
          searchPlaceholder: intl.formatMessage({
            id: "serviceView.searchPlaceholder",
            defaultMessage: "Search Instances",
            description: "Service view search placeholder"
          })
        }}
        sortByProps={{
          sortByAttribute,
          sortByOptions: [
            {
              value: "name",
              label: intl.formatMessage({
                id: "serviceView.name",
                defaultMessage: "Name",
                description: "Option for sort by dropdown"
              })
            },
            {
              value: "start_time",
              label: intl.formatMessage({
                id: "serviceView.uptime",
                defaultMessage: "Uptime",
                description: "Option for sort by dropdown"
              })
            }
          ],
          setSortByAttribute
        }}
      />
      <ErrorBoundary>
        <Table
          type={"Instance"}
          selectedServiceSlug={selectedServiceSlug}
          serviceIsMetered={serviceIsMetered}
          items={orderBy(
            instances.filter(({ name }) =>
              name.toLowerCase().includes(filterString.toLowerCase())
            ),
            [sortByAttribute.toLowerCase()],
            sortOrder
          )}
          status={status}
        />
      </ErrorBoundary>
    </div>
  ) : (
    <NotFoundError
      errorMsg={intl.formatMessage({
        id: "serviceView.error",
        defaultMessage: "No Instances Found",
        description: "Option for sort by dropdown"
      })}
    />
  );
}

export default ServiceView;
