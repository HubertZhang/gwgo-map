import { MapAction } from "@action/map";
import { Viewport } from "react-leaflet";

export interface IMapState {
    readonly viewport: Viewport;
}

export default (state: IMapState, action: MapAction) => {
    switch (action.type) {
        case "ViewportChanged":
            localStorage.setItem("viewport", JSON.stringify(action.newViewport));
            return {
                ...state,
                viewport: action.newViewport,
            };
        default:
            const storedConfig = localStorage.getItem("viewport");
            if (storedConfig) {
                return {
                    ...state,
                    viewport: (JSON.parse(storedConfig) as Viewport),
                };
            }
            return {
                ...state,
                viewport: {center: [31.237023, 121.505742] as [number, number], zoom: 12},
            };
    }
};
