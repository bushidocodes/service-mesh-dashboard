import { Actions } from "jumpstate";
import { PropTypes } from "prop-types";
import React, { Component } from "react";
import { injectIntl } from "react-intl";

import withUrlState from "components/withUrlState";
import { withRouter } from "utils/withRouter";
import { reportError } from "services/notification";
import {
  routerHistoryShape,
  routerLocationShape,
  routerMatchShape,
  serviceShape
} from "components/PropTypes";
import NotFoundError from "components/Main/components/NotFoundError";
import TableToolbar from "components/Main/components/TableToolbar";
import FabricMainView from "./components/FabricMainView";

class FabricGrid extends Component {
  static propTypes = {
    history: routerHistoryShape,
    location: routerLocationShape,
    match: routerMatchShape,
    services: PropTypes.arrayOf(serviceShape),
    setUrlState: PropTypes.func,
    statusView: PropTypes.bool,
    urlState: PropTypes.object
  };

  static defaultProps = {
    services: [],
    statusView: false
  };

  componentDidMount() {
    const {
      location: { state },
      history
    } = this.props;
    // Refresh services from the Fabric Server every time this loads
    Actions.fetchAndStoreFabricMicroservices();
    // State added by fabric router
    // Display message if one is found on state
    if (state && state.message) {
      // Disable polling and clear metrics cache
      Actions.stopPollingAndPurgeInstanceMetrics();
      // Display notification
      reportError(state.message);
      // Reset location state
      history.replace({
        state: {}
      });
    }
  }

  setSortByAttribute = (sortByAttribute) => {
    if (this.props.urlState.sortByAttribute === sortByAttribute) {
      this.props.setUrlState({
        ascending: !JSON.parse(this.props.urlState.ascending)
      });
    } else {
      this.props.setUrlState({ sortByAttribute, ascending: true });
    }
  };

  render() {
    const {
      services,
      setUrlState,
      statusView,
      urlState: {
        ascending = true,
        searchQuery = "",
        sortByAttribute = "Name",
        groupByAttribute = "Status",
        displayType = "Cards"
      },
      intl
    } = this.props;
    const filteredServices = services.filter((service) => {
      return (
        service.name
          .toLowerCase()
          .indexOf(searchQuery && searchQuery.toLowerCase()) !== -1
      );
    });

    // If we're not rendering a statusView,
    // then pass down sortBy props to render the sortBy dropdown
    const sortByProps = statusView
      ? null
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
          setSortByAttribute: this.setSortByAttribute
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
}

export default withRouter(withUrlState()(injectIntl(FabricGrid)));
