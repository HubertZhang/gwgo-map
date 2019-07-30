import { combineReducers } from "redux";
import filterReducer, { IFilterState } from "./filter";
import mapReducer, { IMapState } from "./map";

export interface IAppState {
    readonly yaolingFilter: IFilterState;
    readonly mapData: IMapState;
}

export default combineReducers<IAppState>({ yaolingFilter: filterReducer, mapData: mapReducer });
