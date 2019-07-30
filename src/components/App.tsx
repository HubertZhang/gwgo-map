import * as React from "react";
import { AttributionControl, LayerGroup, LayersControl, Map as MapNode, TileLayer } from "react-leaflet";
import { connect, DispatchProp } from "react-redux";

import { BossLocation, DojoLocation, SpriteLocation } from "@api/Radar";
import { IAppState } from "@reducer/global";

import { SpriteDataSource } from "@api/datasource";
import { Slide, toast, ToastContainer } from "react-toastify";
import * as style from "./App.scss";
import { BossMarker } from "./Marker/BossMarker";
import { DojoMarker } from "./Marker/DojoMarker";
import { EggMarker } from "./Marker/EggMarker";
import { SpriteMarker } from "./Marker/SpriteMarker";
import Dialog from "./Shared/Dialog/Dialog";
import MapControlComponent from "./Shared/MapControlComponent";
import YaolingFilterList from "./YaolingFilter/YaolingFilterList";

import { viewportChanged } from "@action/global";
import "react-toastify/dist/ReactToastify.css";
import { store } from "../store";

const { BaseLayer, Overlay } = LayersControl;

const defaultPosition: [number, number] = [31.193946708086784, 121.28305301070213];

type IProps = (
    DispatchProp &
    ReturnType<typeof mapStateToProps>
);

class App extends React.Component<IProps> {
    private dataSource: SpriteDataSource;

    constructor(props) {
        super(props);
    }

    public componentDidMount(): void {
        this.dataSource = new SpriteDataSource();
        if (this.mapRef.current) {
            this.mapRef.current.leafletElement.on("click", this.forceRequest);
        }
    }

    public mapRef = React.createRef<MapNode>();

    public state = {
        lat: defaultPosition[0],
        lng: defaultPosition[1],
        zoom: 12,
        sprites: [],
        dojo: [],
        showFilterDialog: false,
    };

    public componentDidUpdate(prevProps, prevState) {
        if (prevState.lat !== this.state.lat || prevState.lng !== this.state.lng) {

            this.forceRequest();
        }
    }

    public onViewportChanged = (viewport) => {
        this.props.dispatch(viewportChanged(viewport));
        this.mapRef.current.leafletElement.closePopup();
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
        this.dataSource.fetchYaolingByCenter(this.state.lat, this.state.lng).then((res) => {
            this.setState(() => {
                return {
                    sprites: res,
                };
            });

        }).catch((e) => {
            toast("Error when load yaolings: " + e.toString());
        });
        this.dataSource.fetchDojoByCenter(this.state.lat, this.state.lng).then((res) => {
            this.setState(() => {
                return {
                    dojo: res,
                };
            });
        }).catch((e) => {
            toast("Error when load dojos: " + e.toString());
        });
    }

    public render() {
        return (
            <MapNode className={style.map}
                ref={this.mapRef}
                center={store.getState().mapData.viewport.center}
                zoom={store.getState().mapData.viewport.zoom}
                onViewportChanged={this.onViewportChanged}
                attributionControl={false}
            >
                <ToastContainer
                    position="top-left"
                    transition={Slide}
                    autoClose={2000}
                    hideProgressBar
                    newestOnTop
                    draggable={false}
                />
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
                    <Overlay checked name={"神石"}>
                        <LayerGroup>
                            {
                                this.state.dojo.map((boss: BossLocation) => {
                                    if (boss.state === 1) {
                                        return <EggMarker key={ boss.latitude + "_" + boss.longtitude} boss={boss} />;
                                    } else if (boss.state === 2) {
                                        return <BossMarker key={ boss.latitude + "_" + boss.longtitude} boss={boss} />;
                                    }
                                })}

                        </LayerGroup>
                    </Overlay>
                    <Overlay checked name={"擂台"}>
                        <LayerGroup>
                            {
                                this.state.dojo.filter((d) => (d.state === 0)).map((dojo: DojoLocation) => (
                                    <DojoMarker key={ dojo.latitude + "_" + dojo.longtitude} dojo={dojo} />
                                ))
                            }
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
