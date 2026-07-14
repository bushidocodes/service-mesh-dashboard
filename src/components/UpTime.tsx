import React, { useEffect, useState } from "react";

import { convertMS } from "utils";

interface UpTimeProps {
  // `uptime` is the array produced by convertMS(); consumers map over it to
  // render the formatted parts. Kept loose (any) under the stage-one config.
  render: (uptime: any) => React.ReactNode;
  startTime: number;
}

export default function UpTime({ render, startTime }: UpTimeProps) {
  const [uptime, setUptime] = useState<any[]>([]);

  useEffect(() => {
    const update = () => {
      const elapsed = startTime > 0 ? Date.now() - startTime : 0;
      setUptime(convertMS(elapsed));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  return render(uptime);
}
