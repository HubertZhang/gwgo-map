import { IHideYaoling, IShowYaoling, ISetDisplayedYaoling, IResetDisplayedYaoling } from "./filterYaoling";

export function hideYaoling(id: number): IHideYaoling {
    return { type: "HideYaoling", id };
}

export function showYaoling(id: number): IShowYaoling {
    return { type: "ShowYaoling", id };
}

export function setDisplayedYaolingIDs(ids: number[]): ISetDisplayedYaoling {
    return { type: "SetDisplayedYaoling", ids };
}

export function resetDisplayedYaolingIDs(): IResetDisplayedYaoling {
    return { type: "ResetDisplayedYaoling" };
}