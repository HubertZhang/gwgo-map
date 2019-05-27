import { FilterActions } from "@action/filterYaoling";
import { SpriteConfig } from "@config/SpriteData";

export interface IFilterState {
    readonly ids: Set<number>;
}

export default (state: IFilterState, action: FilterActions) => {
    switch (action.type) {
        case "ShowYaoling":
            return {
                ...state,
                ids: new Set(state.ids).add(action.id),
            };
        case "HideYaoling":
            const newSet = new Set(state.ids);
            newSet.delete(action.id);
            return {
                ...state,
                ids: newSet,
            };
        case "SetDisplayedYaoling":
            return {
                ...state,
                ids: new Set(action.ids),
            };
        case "ResetDisplayedYaoling":
            return {
                ...state,
                ids: new Set(SpriteConfig.keys()),
            };
        default:
            const storedConfig = localStorage.getItem("DisplayedYaolingIDs");
            if (storedConfig) {
                return {
                    ...state,
                    ids: new Set<number>(JSON.parse(storedConfig)),
                };
            }
            return {
                ...state,
                ids: new Set(SpriteConfig.keys()),
            };
    }
};
