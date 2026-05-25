import { PropTypes } from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { getThreadCounts, threadCountsShape } from "utils/jvm/selectors";

/** reusable library component that returns threadCounts
 * @class ThreadCounts
 * @extends {Component}
 */

class ThreadCounts extends React.Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    threadCounts: threadCountsShape.isRequired
  };

  render() {
    return this.props.render(this.props.threadCounts);
  }
}

const mapStateToProps = (state) => {
  return {
    threadCounts: getThreadCounts(state)
  };
};

export default connect(mapStateToProps)(ThreadCounts);
