import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { injectIntl } from "react-intl";
import Table from "components/Main/components/Table";
import TableToolbar from "components/Main/components/TableToolbar";
import ErrorBoundary from "components/ErrorBoundary";
import NotFoundError from "components/Main/components/NotFoundError";

import { getRoutesTable } from "utils/go/selectors";
import withUrlState from "components/withUrlState";

interface RoutesGridProps {
  intl: any;
  routes?: any[];
  setUrlState: (...args: any[]) => any;
  urlState: any;
}

/**
 * Routes Container
 * Parent of RoutesTable and RoutesTableToolbar
 * Contains sort and filter logic for RoutesTable
 * @class RoutesGrid
 * @extends {Component}
 */

class RoutesGrid extends Component<RoutesGridProps> {
  /**
   * Helper function that takes the routes passed as props and sorts according to how sortByAttribute and ascending is set
   * in the url bar.
   * @param {Array} routes
   */
  sort = (routes) => {
    const { ascending = "true", sortByAttribute = "route" } =
      this.props.urlState;
    const sortOrder: ("asc" | "desc")[] =
      ascending === "true" ? ["asc"] : ["desc"];

    return _.orderBy(routes, sortByAttribute, sortOrder);
  };

  /**
   * Helper function used internally to either sort by the key if not yet used to sort or toggle ascending / descending
   * if the key is already active.
   * When sorting by latency and error percent and the sortKey is new, set the initial sort order to descending
   * @param {String} newSortByAttribute
   */
  setSortByAttribute = (newSortByAttribute) => {
    const {
      urlState: { ascending = "true", sortByAttribute = "route" },
      setUrlState
    } = this.props;

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

  render() {
    const {
      setUrlState,
      urlState: { filterString = "", sortByAttribute = "route" },
      routes,
      intl
    } = this.props;

    if (routes && routes.length > 0) {
      return (
        <Fragment>
          <TableToolbar
            searchInputProps={{
              filterString,
              setFilterString: (filterString) => setUrlState({ filterString }),
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
              setSortByAttribute: this.setSortByAttribute
            }}
          />
          <ErrorBoundary>
            <Table
              type={"Route"}
              items={this.sort(
                this.props.routes.filter((routeObj) =>
                  routeObj.route
                    .toLowerCase()
                    .includes(filterString.trim().toLowerCase())
                )
              )}
            />
          </ErrorBoundary>
        </Fragment>
      );
    } else {
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
  }
}

function mapStateToProps(state) {
  return {
    routes: getRoutesTable(state)
  };
}

export default connect(mapStateToProps)(withUrlState()(injectIntl(RoutesGrid)));
