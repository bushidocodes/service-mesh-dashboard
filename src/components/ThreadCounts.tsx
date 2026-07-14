import React from "react";
import { connect } from "react-redux";
import type { RootState, ThreadCounts as ThreadCountsData } from "types";
import { getThreadCounts } from "utils/jvm/selectors";

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

const mapStateToProps = (state: RootState) => {
  return {
    threadCounts: getThreadCounts(state)
  };
};

export default connect(mapStateToProps)(ThreadCounts);
