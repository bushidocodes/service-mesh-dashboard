import type React from "react";
import { useAppSelector } from "store/hooks";
import type { ThreadCounts as ThreadCountsData } from "types";
import { getThreadCounts } from "utils/jvm/selectors";

interface ThreadCountsProps {
  render: (threadCounts: ThreadCountsData) => React.ReactNode;
}

/** reusable library component that returns threadCounts via a render prop */
function ThreadCounts({ render }: ThreadCountsProps) {
  const threadCounts = useAppSelector(getThreadCounts);
  return render(threadCounts);
}

export default ThreadCounts;
