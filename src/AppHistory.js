import { createHashHistory } from "history";

// Just use hash history because our dashboard will be hosted deeply
const history = createHashHistory();

export default history;
