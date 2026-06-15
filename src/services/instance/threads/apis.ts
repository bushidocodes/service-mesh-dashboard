import axios from "axios";

export async function fetchInstanceThreads(endpoint: string) {
  const response = await axios.get(endpoint, { responseType: "json" });
  // The response should have provided JSON, which Axios unpacks auto-magically
  // to an object. We need to manually reject the promise if this didn't happen
  // as expected.
  if (!response.data || typeof response.data !== "object") {
    return Promise.reject("The data object didn't contain JSON as expected");
  }
  return response.data;
}
