import { PropTypes } from "prop-types";
import React, { Component } from "react";

import StackTrace from "./components/StackTrace";

import TableCol from "components/Main/components/TableCol";
import TableColThread from "components/Main/components/TableColThread";
import TableDrawerCollapse from "components/Main/components/TableDrawerCollapse";
import TableRow from "components/Main/components/TableRow";

import StatusIcon from "components/StatusIcon";
import Icon from "components/Icon";
import Glyph from "components/Glyphs/";

import { blurTableRow } from "utils";

/**
 * Line Item containing threads data. Intended to be child of TreadsTable
 * @export
 * @class ThreadsTableLineItem
 * @extends {Component}
 */
export default class ThreadsTableLineItem extends Component {
  static propTypes = {
    daemon: PropTypes.bool,
    id: PropTypes.number,
    name: PropTypes.string,
    priority: PropTypes.number,
    stack: PropTypes.array,
    state: PropTypes.string
  };

  state = {
    isOpen: false // Is the drawer with the stacktrace open or not
  };

  /**
   * Takes a state and returns a corresponding status string associated with that state
   * @param {string} state
   * @returns string
   * @memberof ThreadsTableLineItem
   */
  getStatus(state) {
    switch (state) {
      case "RUNNABLE":
        return "stable";
      case "WAITING":
      case "TIMED_WAITING":
        return "warning";
      case "TERMINATED":
      case "BLOCKED":
      case "NEW":
        return "down";
      default:
        return "default";
    }
  }
  /**
   * Toggles the stacktrace drawer open or closed
   * @memberof ThreadsTableLineItem
   */
  toggleStack = (e) => {
    if (e) {
      blurTableRow(e);
    }
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { daemon, id, name, priority, stack, state } = this.props;

    const status = this.getStatus(state);

    return (
      <TableRow
        isOpen={this.state.isOpen}
        selectable={stack.length > 0}
        key={id}
        onClick={(evt) => {
          stack.length > 0 ? this.toggleStack(evt) : blurTableRow(evt);
        }}
        onKeyDown={(evt) => {
          if (stack.length && evt.keyCode === 13) {
            evt.preventDefault();
            this.toggleStack();
          }
        }}
        role="link"
        tabIndex={0}
      >
        <TableColThread>
          <StatusIcon status={status} />
        </TableColThread>
        <TableColThread>{`${Number(id)}`}</TableColThread>
        <TableCol>{name}</TableCol>
        <TableColThread right>{daemon ? "Yes" : "No"}</TableColThread>
        <TableColThread right>{priority}</TableColThread>
        <TableColThread>
          {stack.length ? (
            <Icon>
              <Glyph name="Threads" />
            </Icon>
          ) : (
            ""
          )}
        </TableColThread>
        <TableDrawerCollapse
          isOpened={this.state.isOpen}
          onClick={(evt) => {
            evt.stopPropagation();
            blurTableRow(evt);
          }}
        >
          <StackTrace>
            <div>{`java.lang.Thread.State: ${state}`}</div>
            {stack.map((value, index) => (
              <div key={index}>{`at ${value}`}</div>
            ))}
          </StackTrace>
        </TableDrawerCollapse>
      </TableRow>
    );
  }
}
