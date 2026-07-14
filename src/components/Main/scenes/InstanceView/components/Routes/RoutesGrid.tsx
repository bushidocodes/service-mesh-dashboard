import ErrorBoundary from "components/ErrorBoundary";
import NotFoundError from "components/Main/components/NotFoundError";
import Table from "components/Main/components/Table";
import TableToolbar from "components/Main/components/TableToolbar";
import { useUrlState } from "components/withUrlState";
import { Fragment } from "react";
import { useIntl } from "react-intl";
import { useAppSelector } from "store/hooks";
import { orderBy } from "utils/collections";
import { getRoutesTable } from "utils/go/selectors";

/**
 * Routes Container
 * Parent of RoutesTable and RoutesTableToolbar
 * Contains sort and filter logic for RoutesTable
 */
function RoutesGrid() {
  const intl = useIntl();
  const { urlState, setUrlState } = useUrlState();
  const routes = useAppSelector(getRoutesTable);

  const {
    filterString = "",
    sortByAttribute = "route",
    ascending = "true"
  } = urlState;

  /**
   * Sorts routes according to sortByAttribute and ascending from url state.
   */
  const sort = (items: any[]) => {
    const sortOrder: ("asc" | "desc")[] =
      ascending === "true" ? ["asc"] : ["desc"];
    return orderBy(items, sortByAttribute, sortOrder);
  };

  /**
   * Toggle ascending when the active key is re-selected; otherwise set a new
   * sort key. Latency / error percent default to descending on first select.
   */
  const setSortByAttribute = (newSortByAttribute: string) => {
    if (sortByAttribute === newSortByAttribute) {
      setUrlState({
        ascending: !JSON.parse(ascending)
      });
    } else if (
      newSortByAttribute === "errorPercent" ||
      newSortByAttribute.includes("latency")
    ) {
      setUrlState({
        sortByAttribute: newSortByAttribute,
        ascending: false
      });
    } else {
      setUrlState({
        sortByAttribute: newSortByAttribute
      });
    }
  };

  if (routes && routes.length > 0) {
    return (
      <Fragment>
        <TableToolbar
          searchInputProps={{
            filterString,
            setFilterString: (nextFilterString) =>
              setUrlState({ filterString: nextFilterString }),
            searchPlaceholder: intl.formatMessage({
              id: "routesGrid.searchPlaceholder",
              defaultMessage: "Search Routes",
              description: "Search placeholder"
            })
          }}
          sortByProps={{
            sortByOptions: [
              {
                value: "route",
                label: intl.formatMessage({
                  id: "routesGrid.route",
                  defaultMessage: "Route",
                  description: "Sort by dropdown option"
                })
              },
              {
                value: "requests",
                label: intl.formatMessage({
                  id: "routesGrid.requests",
                  defaultMessage: "Requests",
                  description: "Sort by dropdown option"
                })
              },
              {
                value: "errorPercent",
                label: intl.formatMessage({
                  id: "routesGrid.errorPercent",
                  defaultMessage: "Error %",
                  description: "Sort by dropdown option"
                })
              },
              {
                value: "latency50",
                label: intl.formatMessage({
                  id: "routesGrid.latency50",
                  defaultMessage: "Latency 50%",
                  description: "Sort by dropdown option"
                })
              },
              {
                value: "latency99",
                label: intl.formatMessage({
                  id: "routesGrid.latency99",
                  defaultMessage: "Latency 99%",
                  description: "Sort by dropdown option"
                })
              }
            ],
            sortByAttribute,
            setSortByAttribute
          }}
        />
        <ErrorBoundary>
          <Table
            type={"Route"}
            items={sort(
              routes.filter((routeObj) =>
                String(routeObj.route)
                  .toLowerCase()
                  .includes(filterString.trim().toLowerCase())
              )
            )}
          />
        </ErrorBoundary>
      </Fragment>
    );
  }

  return (
    <NotFoundError
      errorMsg={intl.formatMessage({
        id: "routesGrid.error",
        defaultMessage: "No Routes Found",
        description: "Error message for RoutesGrid"
      })}
    />
  );
}

export default RoutesGrid;
