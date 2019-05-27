import rootReducer from "@reducer/global";
import { createStore } from "redux";

export const store = createStore(rootReducer);
