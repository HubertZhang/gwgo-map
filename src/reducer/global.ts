import { combineReducers } from "redux";
import filterReducer, { IFilterState } from "./filter";

export interface IAppState {
    readonly yaolingFilter: IFilterState;
}

export default combineReducers<IAppState>({ yaolingFilter: filterReducer });
