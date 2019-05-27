import * as leaflet from "leaflet";
import ReactDOM = require("react-dom");
import { MapControl, MapControlProps, withLeaflet } from "react-leaflet";

class EmptyControl extends leaflet.Control {
    public id: string;

    constructor(option: { id?: string } & leaflet.ControlOptions) {
        super(option);
        this.id = option.id || this._generateId();
    }
    public _generateId() {
        return (Math.random() * 1e20).toString(36);
    }
    public onAdd = () => {
        const controlDiv = leaflet.DomUtil.create("div", this.id);
        leaflet.DomEvent.disableClickPropagation(controlDiv);
        return controlDiv;
    }
    public onRemove = (map: leaflet.Map) => {
        return this;
    }
}

// tslint:disable-next-line: max-classes-per-file
class MapControlComponent extends MapControl<{ id?: string } & MapControlProps> {

    public componentDidMount() {
        super.componentDidMount();

        // This is needed because the control is only attached to the map in
        // MapControl's componentDidMount, so the container is not available
        // until this is called. We need to now force a render so that the
        // portal and children are actually rendered.
        this.forceUpdate();
    }

    public createLeafletElement(props: any) {
        return new EmptyControl({ ...props });
    }

    public render() {
        if (!this.leafletElement || !this.leafletElement.getContainer()) {
            return null;
        }
        return ReactDOM.createPortal(
            this.props.children,
            this.leafletElement.getContainer(),
        );
    }
}

export default withLeaflet(MapControlComponent);
