import { Actions, getState } from "store/jumpstate";
import React, { Component } from "react";
import { connect } from "react-redux";
import type { RootState } from "types";
import _ from "lodash";
import { injectIntl } from "react-intl";

import ThreadsTable from "./components/ThreadsTable";
import ErrorBoundary from "components/ErrorBoundary";
import TableToolbar from "components/Main/components/TableToolbar";
import NotFoundError from "components/Main/components/NotFoundError";
import withUrlState from "components/withUrlState";
import { getVisibleThreads } from "utils/jvm/selectors";

interface ThreadsGridProps {
  fabricServer?: string;
  intl: any;
  selectedInstanceID?: string;
  selectedServiceSlug?: string;
  setUrlState: (...args: any[]) => any;
  threads?: any[];
  threadsError?: Record<string, unknown>;
  urlState: any;
}

/**
 * Parent container of ThreadsTable and TableToolbar
 * @class ThreadsGrid
 * @extends {Component}
 */
class ThreadsGrid extends Component<ThreadsGridProps> {
  componentDidMount() {
    const { fabricServer, selectedServiceSlug, selectedInstanceID } =
      this.props;

    // If fabricServer is truthy, we are running with a "Fabric Server" discovery service,
    // so we need to dynamically build the endpoint for the threads API.
    if (fabricServer && selectedServiceSlug) {
      const services = getState().fabric.services;
      // On a deep link or page refresh of the threads route, the fabric
      // services map may not be populated yet: it is fetched asynchronously by
      // FabricGrid, which only mounts on the root route. Guard against an
      // undefined service so we don't throw while destructuring — the view
      // simply renders "No Threads Found" until the data is available.
      const service = services[selectedServiceSlug];
      if (service) {
        const { name, version } = service;
        Actions.fetchAndStoreInstanceThreads(
          `${fabricServer}/threads/${name}/${version}/${selectedInstanceID}`
        );
      }
    }
  }

  setSortByAttribute = (newSortByAttribute: string) => {
    const {
      urlState: { ascending = "true", sortByAttribute = "id" },
      setUrlState
    } = this.props;
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
   * Helper function that takes the threads passed as props
   * and sorts according to how sortByAttribute and ascending
   * are set in the local state object.
   * @param {Array} threads
   */
  sort(threads: any[] = []) {
    const { ascending, sortByAttribute = "id" } = this.props.urlState;
    let sortOrder: ("asc" | "desc")[] =
      ascending === "true" ? ["asc"] : ["desc"];
    // thread["id"] is a string, so we need to convert to an int to sort properly
    const sortFunc = (thread: any) => {
      return sortByAttribute === "id"
        ? parseInt(thread["id"], 10)
        : thread[sortByAttribute].toLowerCase();
    };
    return _.orderBy(threads, sortFunc, sortOrder);
  }

  render() {
    const {
      setUrlState,
      threads = [],
      threadsError,
      urlState: {
        filterString = "",
        groupByAttribute = "none",
        sortByAttribute = "id"
      },
      intl
    } = this.props;
    const filteredThreads = threads.filter((thread) =>
      thread.name.toLowerCase().includes(filterString.trim().toLowerCase())
    );

    if (threads && threads.length > 0) {
      return (
        <ErrorBoundary>
          <TableToolbar
            searchInputProps={{
              filterString: filterString,
              setFilterString: (filterString) => setUrlState({ filterString }),
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
              setSortByAttribute: this.setSortByAttribute
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
              setGroupByAttribute: (groupByAttribute) =>
                setUrlState({ groupByAttribute })
            }}
          />
          <ThreadsTable
            groupByAttribute={groupByAttribute}
            filteredThreadData={this.sort(filteredThreads)}
          />
        </ErrorBoundary>
      );
    } else if (_.isEmpty(threadsError)) {
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
}

function mapStateToProps(state: RootState) {
  const {
    fabric: { selectedServiceSlug, selectedInstanceID },
    instance: { threadsError },
    settings: { fabricServer }
  } = state;
  return {
    fabricServer,
    threads: getVisibleThreads(state),
    threadsError,
    selectedServiceSlug,
    selectedInstanceID
  };
}

export default connect(mapStateToProps)(
  withUrlState()(injectIntl(ThreadsGrid))
);
