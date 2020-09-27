import { combineReducers } from "redux";
import session from "./session";
import windows from "./windows"

export const rootReducer = combineReducers({
    session: session,
    windows: windows
  })
