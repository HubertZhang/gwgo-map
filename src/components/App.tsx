import * as React from "react";
import { LayerGroup, LayersControl, Map as MapNode, TileLayer, AttributionControl } from "react-leaflet";
import { connect, DispatchProp } from "react-redux";

import Radar, { SpriteLocation, SpriteResponse } from "@api/Radar";
import { IAppState } from "@reducer/global";

import * as style from "./App.scss";
import { SpriteMarker } from "./Marker/SpriteMarker";
import Dialog from "./Shared/Dialog/Dialog";
import MapControlComponent from "./Shared/MapControlComponent";
import { ToastMessages } from "./Toast/ToastMessages";
import YaolingFilterList from "./YaolingFilter/YaolingFilterList";

const { BaseLayer, Overlay } = LayersControl;

const defaultPosition: [number, number] = [31.193946708086784, 121.28305301070213];

type IProps = (
    DispatchProp &
    ReturnType<typeof mapStateToProps>
);

class App extends React.Component<IProps> {
    private radar: Radar;

    constructor(props) {
        super(props);
    }

    public componentDidMount(): void {
        this.radar = new Radar();
        // this.refreshConfig()
        if (this.mapRef.current) {
            this.mapRef.current.leafletElement.on("click", this.forceRequest);
        }
    }

    public refreshConfig = () => {
        this.radar.fetchConfig().then(this.handleConfig).catch(this.refreshConfig);
    }

    public handleConfig = (config) => {
        console.log(config);
    }

    public mapRef = React.createRef<MapNode>();
    public toast = React.createRef<ToastMessages>();

    public state = {
        lat: defaultPosition[0],
        lng: defaultPosition[1],
        zoom: 12,
        sprites: [],
        showFilterDialog: false,
    };

    public componentDidUpdate(prevProps, prevState) {
        if (prevState.lat !== this.state.lat || prevState.lng !== this.state.lng) {

            this.forceRequest();
        }
    }

    public onViewportChanged = (viewport) => {
        this.setState(() => {
            return {
                lat: viewport.center[0],
                lng: viewport.center[1],
                zoom: viewport.zoom,
            };
        });
    }

    public forceRequest = () => {
        if (this.state.zoom < 14) {
            return;
        }
        this.radar.fetchYaolings(this.state.lat, this.state.lng).then((res: SpriteResponse) => {
            // let minLat = Number.MAX_VALUE;
            // let maxLat = 0;
            // let minLng = Number.MAX_VALUE;
            // let maxLng = 0;
            // for (const s of res.sprite_list) {
            //     minLat = Math.min(minLat, s.latitude);
            //     maxLat = Math.max(maxLat, s.latitude);
            //     minLng = Math.min(minLng, s.longtitude);
            //     maxLng = Math.max(maxLng, s.longtitude);
            // }
            // console.log(maxLat - this.state.lat * 1e6, this.state.lat * 1e6 - minLat);
            // console.log(maxLng - this.state.lng * 1e6, this.state.lng * 1e6 - minLng);
            if (res.sprite_list) {
                this.setState(() => {
                    return {
                        sprites: res.sprite_list,
                    };
                });
            }

        }).catch((e) => {
            console.log(e);
            this.toast.current.addToast(e);
        });
    }

    public render() {
        return (
            <MapNode className={style.map}
                ref={this.mapRef}
                center={defaultPosition}
                zoom={12}
                onViewportChanged={this.onViewportChanged}
                attributionControl={false}
            // onClick={this.forceRequest}
            >
                <ToastMessages ref={this.toast}></ToastMessages>
                <Dialog title={"选择显示的妖灵"} hidden={!this.state.showFilterDialog}
                    onClosed={() => { this.setState({ showFilterDialog: false }); }}>
                    <YaolingFilterList></YaolingFilterList>
                </Dialog>
                <LayersControl position={"topright"}>
                    <BaseLayer checked name={"Base map"}>
                        <TileLayer
                            url={"http://rt{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0"}
                            subdomains={"0123"} tms={true} minZoom={3} />
                    </BaseLayer>
                    {/* <Overlay checked name={"Debug"}>
                        <Rectangle bounds={[[this.state.lat - 0.008, this.state.lng - 0.01],
                             [this.state.lat + 0.008, this.state.lng + 0.009]]} color="black" />
                    </Overlay> */}
                    <Overlay checked name={"妖灵"}>
                        <LayerGroup>
                            {this.state.sprites
                                .filter((sprite) => this.props.selected.has(sprite.sprite_id))
                                .map((sprite: SpriteLocation) => (
                                    <SpriteMarker
                                        key={sprite.gentime + "_" + sprite.latitude + "_" + sprite.longtitude}
                                        sprite={sprite} />
                                ))}
                        </LayerGroup>
                    </Overlay>
                    <Overlay name={"神石"}>
                        <LayerGroup>
                            {/*{this.state.sprites.filter(()=> true).map((sprite: SpriteLocation) => (*/}
                            {/*    <SpriteMarker*/}
                            {/*        key={sprite.gentime + "_" + sprite.latitude + "_" + sprite.longtitude}*/}
                            {/*        sprite={sprite}/>*/}
                            {/*))}*/}
                        </LayerGroup>
                    </Overlay>
                    <Overlay name={"擂台"}>
                        <LayerGroup>
                            {/*{this.state.sprites.filter(()=> true).map((sprite: SpriteLocation) => (*/}
                            {/*    <SpriteMarker*/}
                            {/*        key={sprite.gentime + "_" + sprite.latitude + "_" + sprite.longtitude}*/}
                            {/*        sprite={sprite}/>*/}
                            {/*))}*/}
                        </LayerGroup>
                    </Overlay>
                </LayersControl>
                <MapControlComponent id={style["yaoling-filter-button"]} position={"topright"}>
                    <a onClick={() => { this.setState({ showFilterDialog: true }); }}></a>
                </MapControlComponent>
                <MapControlComponent id={style["locate-button"]} position={"topright"}>
                    <a onClick={() => {
                        this.mapRef.current.leafletElement.locate({ setView: true, maxZoom: 16 });
                    }}></a>
                </MapControlComponent>
                <AttributionControl prefix='Icons made by <a href="https://www.freepik.com/" title="Freepik">Freepik</a>
                        from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>'>
                </AttributionControl>
                <AttributionControl prefix='<a href="https://leafletjs.com"
                 title="A JS library for interactive maps">Leaflet</a>'>
                </AttributionControl>
            </MapNode>
        );
    }
}

const mapStateToProps = (state: IAppState) => ({
    selected: state.yaolingFilter.ids,
});

export default connect(mapStateToProps)(App);
