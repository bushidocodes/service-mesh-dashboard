import { Route, Routes } from "react-router-dom";

import FabricAppHeaderContent from "./FabricHeaderContent";
import InstanceHeaderContent from "./InstanceHeaderContent";
import ServiceHeaderContent from "./ServiceHeaderContent";

// v4 used the regex syntax /:path(|stable|down|warning) which is not supported
// in v6. The four paths are listed explicitly instead.
function AppHeaderContent() {
  return (
    <Routes>
      <Route path="/" element={<FabricAppHeaderContent />} />
      <Route path="/stable" element={<FabricAppHeaderContent />} />
      <Route path="/down" element={<FabricAppHeaderContent />} />
      <Route path="/warning" element={<FabricAppHeaderContent />} />
      <Route path="/:selectedServiceSlug" element={<ServiceHeaderContent />} />
      <Route
        path="/:selectedServiceSlug/:selectedInstanceID/*"
        element={<InstanceHeaderContent />}
      />
    </Routes>
  );
}

// v6 Routes re-renders automatically on location changes — withRouter no longer needed
export default AppHeaderContent;
