import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

import { convertMS } from "utils";

export default function UpTime({ render, startTime }) {
  const [uptime, setUptime] = useState([]);

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

UpTime.propTypes = {
  render: PropTypes.func.isRequired,
  startTime: PropTypes.number.isRequired
};
