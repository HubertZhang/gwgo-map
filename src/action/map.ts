import { Viewport } from "react-leaflet";
import { Action } from "redux";

export interface IViewportChanged extends Action<"ViewportChanged"> {
    newViewport: Viewport;
}

export type MapAction = IViewportChanged;
