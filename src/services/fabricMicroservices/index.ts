import { Effect } from "store/jumpstate";
import {
  changeFabricMicroservicesPollingIntervalEffect,
  fetchAndStoreFabricMicroservicesEffect,
  fetchFabricMicroservicesFailureEffect,
  fetchFabricMicroservicesSuccessEffect,
  selectInstanceEffect,
  startPollingFabricMicroservicesEffect,
  stopPollingFabricMicroservicesEffect
} from "./fabricMicroservices";

Effect(
  "fetchFabricMicroservicesFailure",
  fetchFabricMicroservicesFailureEffect
);

Effect(
  "fetchAndStoreFabricMicroservices",
  fetchAndStoreFabricMicroservicesEffect
);

Effect(
  "fetchFabricMicroservicesSuccess",
  fetchFabricMicroservicesSuccessEffect
);

Effect(
  "changeFabricMicroservicesPollingInterval",
  changeFabricMicroservicesPollingIntervalEffect
);

Effect(
  "startPollingFabricMicroservices",
  startPollingFabricMicroservicesEffect
);

Effect("stopPollingFabricMicroservices", stopPollingFabricMicroservicesEffect);

Effect("selectInstance", selectInstanceEffect);
