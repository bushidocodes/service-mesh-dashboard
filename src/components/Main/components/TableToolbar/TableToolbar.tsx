// NPM Modules
import React from "react";
import { injectIntl } from "react-intl";
// Internal Components
import SearchInput from "components/Main/components/GMSearchInput";
import Button from "components/Button";
import Form from "./components/Form";
import GMSelect from "components/Main/components/GMSelect";
import { GMSelectValueRenderer } from "components/Main/components/GMSelect";
import Toolbar from "./components/Toolbar";
import ToolbarLeft from "./components/ToolbarLeft";
import ToolbarRight from "./components/ToolbarRight";
import ToolbarCenter from "./components/ToolbarCenter";

interface TableToolbarProps {
  displayTypeProps?: {
    displayType: "Cards" | "List";
    setDisplayType: (...args: any[]) => any;
  };
  groupByProps?: {
    groupByAttribute: string;
    groupByOptions: Record<string, unknown>[];
    setGroupByAttribute: (...args: any[]) => any;
  };
  searchInputProps?: {
    filterString: string;
    setFilterString: (...args: any[]) => any;
    searchPlaceholder: string;
  };
  sortByProps?: {
    setSortByAttribute?: (...args: any[]) => any;
    sortByAttribute?: string;
    sortByOptions?: Record<string, unknown>[];
  };
  // the following are optional props to be rendered as children of their respective columns
  toolbarCenterChildren?: React.ReactElement | React.ReactNode;
  toolbarLeftChildren?: React.ReactElement | React.ReactNode;
  toolbarRightChildren?: React.ReactElement | React.ReactNode;
  intl: any;
}

/** A reusable toolbar that renders any combination of search box, display type toggle buttons,
 *  and sorting or grouping dropdowns. To render a subcomponent, pass it the correct props.
 *  You may also use toolbar children props to render custom subcomponents.
 * @function TableToolbar
 */

function TableToolbar({
  displayTypeProps,
  searchInputProps,
  groupByProps,
  sortByProps,
  toolbarLeftChildren,
  toolbarCenterChildren,
  toolbarRightChildren,
  intl
}: TableToolbarProps) {
  return (
    <Toolbar>
      <ToolbarLeft>
        {searchInputProps && (
          <Form>
            <SearchInput
              onChange={(evt) =>
                searchInputProps.setFilterString(evt.target.value)
              }
              placeholder={searchInputProps.searchPlaceholder}
              aria-label={searchInputProps.searchPlaceholder}
              value={searchInputProps.filterString}
            />
          </Form>
        )}
        {toolbarLeftChildren}
      </ToolbarLeft>
      <ToolbarCenter>
        {displayTypeProps && [
          <Button
            active={displayTypeProps.displayType === "Cards"}
            clickAction={() => displayTypeProps.setDisplayType("Cards")}
            glyph="Card"
            label={intl.formatMessage({
              id: "tableToolbar.cards",
              defaultMessage: "Cards",
              description: "Display type button"
            })}
            key="Cards"
          />,
          <Button
            active={displayTypeProps.displayType === "List"}
            clickAction={() => displayTypeProps.setDisplayType("List")}
            glyph="List"
            label={intl.formatMessage({
              id: "tableToolbar.list",
              defaultMessage: "List",
              description: "Display type button"
            })}
            key="List"
          />
        ]}
        {toolbarCenterChildren}
      </ToolbarCenter>
      <ToolbarRight>
        {groupByProps && (
          <GMSelect
            name="form-field-group-by"
            options={groupByProps.groupByOptions}
            value={groupByProps.groupByAttribute}
            onChange={(val) => {
              val && groupByProps.setGroupByAttribute(val.value);
            }}
            clearable={false}
            searchable={true}
            valueRenderer={(val) => (
              <GMSelectValueRenderer
                title={intl.formatMessage({
                  id: "tableToolbar.group",
                  defaultMessage: "Group",
                  description: "Group by dropdown title"
                })}
                val={val}
              />
            )}
          />
        )}
        {sortByProps && (
          <GMSelect
            name="form-field-sort-by"
            options={sortByProps.sortByOptions}
            value={sortByProps.sortByAttribute}
            onChange={(val) => {
              val && sortByProps.setSortByAttribute?.(val.value);
            }}
            clearable={false}
            searchable={true}
            valueRenderer={(val) => (
              <GMSelectValueRenderer
                title={intl.formatMessage({
                  id: "tableToolbar.sort",
                  defaultMessage: "Sort",
                  description: "Sort by dropdown title"
                })}
                val={val}
              />
            )}
          />
        )}
        {toolbarRightChildren}
      </ToolbarRight>
    </Toolbar>
  );
}

export default injectIntl(TableToolbar);
