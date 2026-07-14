import NotFoundError from "components/Main/components/NotFoundError";
import TableToolbar from "components/Main/components/TableToolbar";
import withUrlState from "components/withUrlState";
import React, { Component } from "react";
import { reportError } from "services/notification";
import { Actions } from "store/jumpstate";
import type {
  RouterHistory,
  RouterLocation,
  RouterMatch,
  Service
} from "types";
import { injectIntl } from "utils/injectIntl";
import { withRouter } from "utils/withRouter";
import FabricMainView from "./components/FabricMainView";

interface FabricGridProps {
  // history/location/setUrlState/urlState are always supplied by the withRouter
  // and withUrlState HOCs that wrap this component on export, so they are
  // required here even though external callers never pass them directly.
  history: RouterHistory;
  intl: any;
  location: RouterLocation;
  match?: RouterMatch;
  services?: Service[];
  setUrlState: (...args: any[]) => any;
  statusView?: boolean;
  urlState?: any;
}

class FabricGrid extends Component<FabricGridProps> {
  static defaultProps = {
    services: [],
    statusView: false
  };

  componentDidMount() {
    const {
      location: { state },
      history
    } = this.props;
    const locationState = state as any;
    // Refresh services from the Fabric Server every time this loads
    Actions.fetchAndStoreFabricMicroservices();
    // State added by fabric router
    // Display message if one is found on state
    if (locationState && locationState.message) {
      // Disable polling and clear metrics cache
      Actions.stopPollingAndPurgeInstanceMetrics();
      // Display notification
      (reportError as any)(locationState.message);
      // Reset location state. Defer past the current commit: componentDidMount
      // runs in React's layout phase, before React Router's passive effect marks
      // navigation as active, so calling navigate()/history.replace() here
      // synchronously triggers a "You should call navigate() in a
      // React.useEffect()" warning. A setTimeout(0) runs after the passive
      // effects have flushed, when navigation is ready.
      setTimeout(() => (history as any).replace({ state: {} }), 0);
    }
  }

  setSortByAttribute = (sortByAttribute: string) => {
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
      services = [],
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

export default withRouter((withUrlState as any)()(injectIntl(FabricGrid)));
