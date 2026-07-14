import type { ThunkAction, UnknownAction } from "@reduxjs/toolkit";
import type { RootState } from "types";

/**
 * Typed thunk for RTK async/service logic (fabric, dashboards, …).
 * Defined outside `store/index` so service modules can import it without a
 * circular dependency on the store singleton.
 */
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>;
