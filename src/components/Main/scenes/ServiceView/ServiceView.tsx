import React, { Component } from "react";
import { Actions } from "store/jumpstate";
import { orderBy } from "utils/collections";
import { withRouter } from "utils/withRouter";
import { injectIntl } from "utils/injectIntl";

import Table from "components/Main/components/Table";
import TableToolbar from "components/Main/components/TableToolbar";
import ErrorBoundary from "components/ErrorBoundary";
import NotFoundError from "components/Main/components/NotFoundError";
import { reportError } from "services/notification";
import withUrlState from "components/withUrlState";
import type { RouterHistory, RouterLocation, ServiceInstance } from "types";

interface ServiceViewProps {
  history: RouterHistory;
  instances: ServiceInstance[];
  intl: any;
  location: RouterLocation;
  selectedServiceSlug: string;
  serviceIsMetered?: boolean;
  setUrlState: (...args: any[]) => any;
  status: string;
  urlState: any;
}

class ServiceView extends Component<ServiceViewProps> {
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
      // Reset location state. Defer past the current commit: componentDidMount
      // runs in React's layout phase, before React Router's passive effect marks
      // navigation as active, so calling navigate()/history.replace() here
      // synchronously triggers a "You should call navigate() in a
      // React.useEffect()" warning. A setTimeout(0) runs after the passive
      // effects have flushed, when navigation is ready.
      setTimeout(() => history.replace({ state: {} }), 0);
    }
  }

  setSortByAttribute = (newSortByAttribute: string) => {
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
            setSortByAttribute: this.setSortByAttribute
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
}

export default withRouter(withUrlState()(injectIntl(ServiceView)));
