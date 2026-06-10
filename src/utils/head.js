// Utils for running with a Fabric Server

/**
 * getFabricServer is a utility function that extracts the fabricServer property
 * from the HEAD of the index.html file and returns it if it's been set.
 * Otherwise, if NODE_ENV is in development mode, it returns http://localhost:9000
 * @returns {String}
 */
export function getFabricServer() {
  const metaTag = document.head.querySelector("[property=fabricServer]");
  const fabricServer = metaTag ? metaTag.content : null;
  // Return the metatag if set
  if (fabricServer && fabricServer !== "__FABRIC_SERVER__") {
    return fabricServer;
  } else if (process.env.NODE_ENV === "development") {
    return "http://localhost:9000";
  } else {
    return null;
  }
}
