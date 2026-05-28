import React from "react";

import TableToolbar from "./index.js";

const sortByOptions = [
  {
    value: "Name",
    label: "Name"
  },
  {
    value: "Status",
    label: "Status"
  }
];

const groupByOptions = [
  {
    value: "Owner",
    label: "Owner"
  },
  {
    value: "Status",
    label: "Status"
  }
];

const mockFabricViewProps = {
  displayTypeProps: {
    displayType: "Cards",
    setDisplayType: () => alert("fired setDisplayType")
  },
  searchInputProps: {
    filterString: "",
    searchPlaceholder: "Search Services",
    setFilterString: () => alert("fired setFilterString")
  },
  groupByProps: {
    groupByOptions,
    groupByAttribute: "Status",
    setGroupByAttribute: () => alert("fired setGroupByAttribute")
  },
  sortByProps: {
    sortByOptions,
    sortByAttribute: "Name",
    setSortByAttribute: () => alert("fired setSortByAttribute")
  }
};

export default {
  title: "Table Toolbar",
  component: TableToolbar
};

export const Default = {
  render: () => (
    <div style={{ width: "100%" }}>
      <TableToolbar {...mockFabricViewProps} />
    </div>
  )
};
