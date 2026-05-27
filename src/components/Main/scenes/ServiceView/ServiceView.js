import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { Actions } from "jumpstate";
import _ from "lodash";
import { withRouter } from "utils/withRouter";
import { injectIntl, intlShape } from "react-intl";

import Table from "components/Main/components/Table";
import TableToolbar from "components/Main/components/TableToolbar";
import ErrorBoundary from "components/ErrorBoundary";
import NotFoundError from "components/Main/components/NotFoundError";
import { reportError } from "services/notification";
import {
  routerHistoryShape,
  routerLocationShape,
  serviceInstanceShape
} from "components/PropTypes";
import withUrlState from "components/withUrlState";

class ServiceView extends Component {
  static propTypes = {
    history: routerHistoryShape.isRequired,
    instances: PropTypes.arrayOf(serviceInstanceShape).isRequired,
    intl: intlShape.isRequired,
    location: routerLocationShape.isRequired,
    selectedServiceSlug: PropTypes.string.isRequired,
    serviceIsMetered: PropTypes.bool,
    setUrlState: PropTypes.func.isRequired,
    status: PropTypes.string.isRequired,
    urlState: PropTypes.object.isRequired
  };

  componentDidMount() {
    const {
      location: { state },
      history
    } = this.props;
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

  setSortByAttribute = (newSortByAttribute) => {
    const {
      urlState: { ascending = "true", sortByAttribute = "name" },
      setUrlState
    } = this.props;
    if (sortByAttribute === newSortByAttribute) {
      setUrlState({ ascending: !JSON.parse(ascending) });
    } else {
      setUrlState({ sortByAttribute: newSortByAttribute });
    }
  };

  render() {
    const {
      selectedServiceSlug,
      setUrlState,
      status,
      instances,
      serviceIsMetered,
      urlState: {
        filterString = "",
        sortByAttribute = "name",
        ascending = "true"
      },
      intl
    } = this.props;

    const sortOrder = JSON.parse(ascending) ? ["asc"] : ["desc"];

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
            setSortByAttribute: this.setSortByAttribute
          }}
        />
        <ErrorBoundary>
          <Table
            type={"Instance"}
            selectedServiceSlug={selectedServiceSlug}
            serviceIsMetered={serviceIsMetered}
            items={_.orderBy(
              instances.filter(
                ({ name }) =>
                  name.toLowerCase().indexOf(filterString.toLowerCase()) !== -1
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
}

export default withRouter(withUrlState()(injectIntl(ServiceView)));
