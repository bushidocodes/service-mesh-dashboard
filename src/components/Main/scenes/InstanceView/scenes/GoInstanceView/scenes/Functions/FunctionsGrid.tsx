import ErrorBoundary from "components/ErrorBoundary";
import NotFoundError from "components/Main/components/NotFoundError";
import Table from "components/Main/components/Table";
import TableToolbar from "components/Main/components/TableToolbar";
import { useUrlState } from "components/withUrlState";
import { Fragment } from "react";
import { useIntl } from "react-intl";
import { useAppSelector } from "store/hooks";
import { orderBy } from "utils/collections";
import { getFunctionsTable } from "utils/go/selectors";

/**
 * Go Functions Container
 * Parent of FunctionsTable and FunctionsTableToolbar
 * Contains sort and filter logic for FunctionsTable
 */
function FunctionsGrid() {
  const intl = useIntl();
  const { urlState, setUrlState } = useUrlState();
  const funcs = useAppSelector(getFunctionsTable);

  const {
    filterString = "",
    sortByAttribute = "func",
    ascending = "true"
  } = urlState;

  /**
   * Sorts funcs according to sortByAttribute and ascending from url state.
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

  if (funcs && funcs.length > 0) {
    return (
      <Fragment>
        <TableToolbar
          searchInputProps={{
            filterString,
            setFilterString: (nextFilterString) =>
              setUrlState({ filterString: nextFilterString }),
            searchPlaceholder: intl.formatMessage({
              id: "functionsGrid.searchPlaceholder",
              defaultMessage: "Search Functions",
              description: "Search placeholder"
            })
          }}
          sortByProps={{
            sortByOptions: [
              {
                value: "func",
                label: intl.formatMessage({
                  id: "functionsGrid.function",
                  defaultMessage: "Function",
                  description: "Sort by dropdown option"
                })
              },
              {
                value: "requests",
                label: intl.formatMessage({
                  id: "functionsGrid.requests",
                  defaultMessage: "Requests",
                  description: "Sort by dropdown option"
                })
              },
              {
                value: "errorCount",
                label: intl.formatMessage({
                  id: "functionsGrid.errorPercent",
                  defaultMessage: "Error %",
                  description: "Sort by dropdown option"
                })
              },
              {
                value: "latency50",
                label: intl.formatMessage({
                  id: "functionsGrid.latency50",
                  defaultMessage: "Latency 50%",
                  description: "Sort by dropdown option"
                })
              },
              {
                value: "latency99",
                label: intl.formatMessage({
                  id: "functionsGrid.latency99",
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
            type={"Function"}
            items={sort(
              funcs.filter((funcObj) =>
                String(funcObj.func)
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
        id: "functionsGrid.error",
        defaultMessage: "No Functions Found",
        description: "Error message for Functions Grid"
      })}
    />
  );
}

export default FunctionsGrid;
