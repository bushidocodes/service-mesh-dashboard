import axios from "axios";

export function fetchInstanceThreads(endpoint) {
  return axios.get(endpoint, { responseType: "json" }).then((response) => {
    // The response should have provided JSON, which Axios unpacks auto-magically
    // to an object. We need to manually reject the promise if this didn't happen
    // as expected.
    if (!response.data || typeof response.data !== "object") {
      return Promise.reject("The data object didn't contain JSON as expected");
    } else {
      return response.data;
    }
  });
}
