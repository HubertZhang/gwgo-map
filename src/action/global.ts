import { Viewport } from "react-leaflet";
import { IHideYaoling, IResetDisplayedYaoling, ISetDisplayedYaoling, IShowYaoling } from "./filterYaoling";
import { IViewportChanged } from "./map";

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

export function viewportChanged(viewport: Viewport): IViewportChanged {
    return { type: "ViewportChanged", newViewport: viewport };
}
