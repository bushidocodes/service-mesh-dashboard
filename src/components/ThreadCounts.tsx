import React from "react";
import { connect } from "react-redux";

import { getThreadCounts } from "utils/jvm/selectors";
import type { ThreadCounts as ThreadCountsData } from "types";

interface ThreadCountsProps {
  render: (threadCounts: ThreadCountsData) => React.ReactNode;
  threadCounts: ThreadCountsData;
}

/** reusable library component that returns threadCounts via a render prop */
class ThreadCounts extends React.Component<ThreadCountsProps> {
  render() {
    return this.props.render(this.props.threadCounts);
  }
}

const mapStateToProps = (state: any) => {
  return {
    threadCounts: getThreadCounts(state)
  };
};

export default connect(mapStateToProps)(ThreadCounts);
