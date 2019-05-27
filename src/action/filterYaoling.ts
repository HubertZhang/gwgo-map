import { Action } from "redux";

export interface IHideYaoling extends Action<"HideYaoling"> {
    id: number;
}

export interface IShowYaoling extends Action<"ShowYaoling"> {
    id: number;
}

export interface ISetDisplayedYaoling extends Action<"SetDisplayedYaoling"> {
    ids: number[];
}

export interface IResetDisplayedYaoling extends Action<"ResetDisplayedYaoling"> {
}

export type FilterActions = IHideYaoling | IShowYaoling | ISetDisplayedYaoling | IResetDisplayedYaoling;
