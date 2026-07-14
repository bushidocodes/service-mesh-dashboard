import ErrorBoundary from "components/ErrorBoundary";
import NotFoundError from "components/Main/components/NotFoundError";
import TableToolbar from "components/Main/components/TableToolbar";
import { useUrlState } from "components/withUrlState";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { fetchAndStoreInstanceThreads } from "services/instance/threads";
import { useAppDispatch, useAppSelector } from "store/hooks";
import type { ThreadsTableItem } from "types";
import { isEmpty, orderBy } from "utils/collections";
import { getVisibleThreads } from "utils/jvm/selectors";
import ThreadsTable from "./components/ThreadsTable";

/**
 * Parent container of ThreadsTable and TableToolbar
 */
function ThreadsGrid() {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { urlState, setUrlState } = useUrlState();

  const fabricServer = useAppSelector((state) => state.settings.fabricServer);
  const selectedServiceSlug = useAppSelector(
    (state) => state.fabric.selectedServiceSlug
  );
  const selectedInstanceID = useAppSelector(
    (state) => state.fabric.selectedInstanceID
  );
  const services = useAppSelector((state) => state.fabric.services);
  // getVisibleThreads is typed with a narrow { state? } row; full thread fields live on ThreadsTableItem.
  const threads = useAppSelector(getVisibleThreads) as ThreadsTableItem[];
  const threadsError = useAppSelector((state) => state.instance.threadsError);

  const service =
    selectedServiceSlug && services ? services[selectedServiceSlug] : undefined;
  const serviceName = service?.name;
  const serviceVersion = service?.version;

  // If fabricServer is truthy, we are running with a "Fabric Server" discovery service,
  // so we need to dynamically build the endpoint for the threads API.
  // On a deep link or page refresh of the threads route, the fabric services map
  // may not be populated yet: it is fetched asynchronously. Depend on the resolved
  // service name/version so we fetch once the service becomes available.
  useEffect(() => {
    if (fabricServer && serviceName && serviceVersion && selectedInstanceID) {
      dispatch(
        fetchAndStoreInstanceThreads(
          `${fabricServer}/threads/${serviceName}/${serviceVersion}/${selectedInstanceID}`
        )
      );
    }
  }, [dispatch, fabricServer, serviceName, serviceVersion, selectedInstanceID]);

  const {
    filterString = "",
    groupByAttribute = "none",
    sortByAttribute = "id",
    ascending = "true"
  } = urlState;

  const setSortByAttribute = (newSortByAttribute: string) => {
    if (newSortByAttribute === sortByAttribute) {
      setUrlState({
        ascending: !JSON.parse(ascending)
      });
    } else {
      setUrlState({
        sortByAttribute: newSortByAttribute,
        ascending: true
      });
    }
  };

  /**
   * Sorts threads according to sortByAttribute and ascending from url state.
   */
  const sort = (threadList: ThreadsTableItem[] = []) => {
    const sortOrder: ("asc" | "desc")[] =
      ascending === "true" ? ["asc"] : ["desc"];
    // thread["id"] is a string, so we need to convert to an int to sort properly
    const sortFunc = (thread: ThreadsTableItem) => {
      return sortByAttribute === "id"
        ? parseInt(String(thread.id), 10)
        : String(
            thread[sortByAttribute as keyof ThreadsTableItem]
          ).toLowerCase();
    };
    return orderBy(threadList, sortFunc, sortOrder);
  };

  const threadList = threads ?? [];
  const filteredThreads = threadList.filter((thread) =>
    (thread.name ?? "")
      .toLowerCase()
      .includes(filterString.trim().toLowerCase())
  );

  if (threadList.length > 0) {
    return (
      <ErrorBoundary>
        <TableToolbar
          searchInputProps={{
            filterString: filterString,
            setFilterString: (nextFilterString) =>
              setUrlState({ filterString: nextFilterString }),
            searchPlaceholder: intl.formatMessage({
              id: "threadsGrid.searchPlaceholder",
              defaultMessage: "Search Threads",
              description: "Search placeholder"
            })
          }}
          sortByProps={{
            sortByOptions: [
              {
                value: "state",
                label: intl.formatMessage({
                  id: "threadsGrid.state",
                  defaultMessage: "State",
                  description: "Sort by dropdown option"
                })
              },
              {
                value: "name",
                label: intl.formatMessage({
                  id: "threadsGrid.name",
                  defaultMessage: "Name",
                  description: "Sort by dropdown option"
                })
              },
              {
                value: "id",
                label: intl.formatMessage({
                  id: "threadsGrid.id",
                  defaultMessage: "ID",
                  description: "Sort by dropdown option"
                })
              }
            ],
            sortByAttribute: sortByAttribute,
            setSortByAttribute
          }}
          groupByProps={{
            groupByOptions: [
              {
                value: "state",
                label: intl.formatMessage({
                  id: "threadsGrid.state",
                  defaultMessage: "State",
                  description: "Group by dropdown option"
                })
              },
              {
                value: "none",
                label: intl.formatMessage({
                  id: "threadsGrid.none",
                  defaultMessage: "None",
                  description: "Group by dropdown option"
                })
              }
            ],
            groupByAttribute: groupByAttribute,
            setGroupByAttribute: (nextGroupByAttribute) =>
              setUrlState({ groupByAttribute: nextGroupByAttribute })
          }}
        />
        <ThreadsTable
          groupByAttribute={groupByAttribute}
          filteredThreadData={sort(filteredThreads)}
        />
      </ErrorBoundary>
    );
  } else if (isEmpty(threadsError)) {
    return (
      <NotFoundError
        errorMsg={intl.formatMessage({
          id: "threadsGrid.errorNotFound",
          defaultMessage: "No Threads Found",
          description: "Error message"
        })}
      />
    );
  } else {
    return (
      <NotFoundError
        errorMsg={intl.formatMessage({
          id: "threadsGrid.errorFetchFail",
          defaultMessage: "Failed to Fetch Threads",
          description: "Error message"
        })}
      />
    );
  }
}

export default ThreadsGrid;
