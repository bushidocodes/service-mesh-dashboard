import NotFoundError from "components/Main/components/NotFoundError";
import TableToolbar from "components/Main/components/TableToolbar";
import { useUrlState } from "components/withUrlState";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import { reportError } from "services/notification";
import { Actions } from "store/jumpstate";
import type { Service } from "types";
import FabricMainView from "./components/FabricMainView";

interface FabricGridProps {
  services?: Service[];
  statusView?: boolean;
}

function FabricGrid({ services = [], statusView = false }: FabricGridProps) {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();
  const { urlState, setUrlState } = useUrlState();

  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only; mirrors former componentDidMount (fetch + one-shot location message)
  useEffect(() => {
    // Refresh services from the Fabric Server every time this loads
    Actions.fetchAndStoreFabricMicroservices();
    // State added by fabric router
    // Display message if one is found on state
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
    ascending = "true",
    searchQuery = "",
    sortByAttribute = "Name",
    groupByAttribute = "Status",
    displayType: displayTypeParam = "Cards"
  } = urlState;
  const displayType =
    displayTypeParam === "List" ? ("List" as const) : ("Cards" as const);

  const setSortByAttribute = (nextSortByAttribute: string) => {
    if (urlState.sortByAttribute === nextSortByAttribute) {
      // Use destructured `ascending` (defaults to "true") so JSON.parse gets a
      // definite string under noUncheckedIndexedAccess.
      setUrlState({
        ascending: !JSON.parse(ascending)
      });
    } else {
      setUrlState({ sortByAttribute: nextSortByAttribute, ascending: true });
    }
  };

  const filteredServices = services.filter((service) => {
    return service.name
      .toLowerCase()
      .includes(searchQuery?.toLowerCase() ?? "");
  });

  // If we're not rendering a statusView,
  // then pass down sortBy props to render the sortBy dropdown
  const sortByProps = statusView
    ? undefined
    : {
        sortByOptions: [
          {
            value: "Name",
            label: intl.formatMessage({
              id: "fabric.name",
              defaultMessage: "Name",
              description: "Option for sort by dropdown"
            })
          },
          {
            value: "Status",
            label: intl.formatMessage({
              id: "fabric.status",
              defaultMessage: "Status",
              description: "Option for sort by dropdown"
            })
          }
        ],
        sortByAttribute: sortByAttribute,
        setSortByAttribute
      };

  if (services && services.length > 0) {
    return (
      <div>
        <TableToolbar
          displayTypeProps={{
            displayType: displayType,
            setDisplayType: (displayType) => setUrlState({ displayType })
          }}
          searchInputProps={{
            filterString: searchQuery,
            setFilterString: (searchQuery) => setUrlState({ searchQuery }),
            searchPlaceholder: intl.formatMessage({
              id: "fabric.searchPlaceholder",
              defaultMessage: "Search Services",
              description: "Search placeholder"
            })
          }}
          groupByProps={{
            groupByOptions: [
              {
                value: "Owner",
                label: intl.formatMessage({
                  id: "fabric.owner",
                  defaultMessage: "Owner",
                  description: "Option for group by dropdown"
                })
              },
              {
                value: "Capability",
                label: intl.formatMessage({
                  id: "fabric.capability",
                  defaultMessage: "Capability",
                  description: "Option for group by dropdown"
                })
              },
              {
                value: "Status",
                label: intl.formatMessage({
                  id: "fabric.status",
                  defaultMessage: "Status",
                  description: "Option for group by dropdown"
                })
              },
              {
                value: "None",
                label: intl.formatMessage({
                  id: "fabric.none",
                  defaultMessage: "None",
                  description: "Option for group by dropdown"
                })
              }
            ],
            groupByAttribute: groupByAttribute,
            setGroupByAttribute: (groupByAttribute) =>
              setUrlState({ groupByAttribute })
          }}
          sortByProps={sortByProps}
        />
        {/* pass filtered services to FabricMainView */}
        <FabricMainView
          displayType={displayType}
          groupByAttribute={groupByAttribute}
          sortByAttribute={sortByAttribute}
          services={filteredServices}
          ascending={JSON.parse(ascending)}
        />
      </div>
    );
  } else {
    return (
      <NotFoundError
        errorMsg={intl.formatMessage({
          id: "fabric.error",
          defaultMessage: "No Services Found",
          description: "Not found error"
        })}
      />
    );
  }
}

export default FabricGrid;
