import Radar, { SpriteLocation, SpriteResponse } from "@api/Radar";
import { filterYaoling, SpriteConfig } from "@api/SpriteData";
import { icon } from "leaflet";
import * as React from "react";
import { LayerGroup, LayersControl, Map as MapNode, Marker, TileLayer } from "react-leaflet";
import "./App.css";

const { BaseLayer, Overlay } = LayersControl;

const Prefix = "https://hy.gwgo.qq.com/sync/pet/";

const SpriteMarker = ({ sprite: sprite }) => (
    <Marker position={{ lat: sprite.latitude / 1e6, lng: sprite.longtitude / 1e6 }}
        icon={icon({
            iconUrl: Prefix + SpriteConfig.get(sprite.sprite_id).SmallImgPath,
            iconSize: [32, 32],
        })}>
    </Marker>
);

const defaultPosition: [number, number] = [31.193946708086784, 121.28305301070213];
// class MyMarkersList extends React.Component<{ markers: Array<SpriteLocation> }> {
//     render() {
//         let {markers} = this.props;
//         const items = markers.map((sprite: SpriteLocation) => (
//
//             <SpriteMarker key={sprite.gentime + "_" + sprite.latitude + "_" + sprite.longtitude} sprite={sprite}/>
//         ));
//         return <React.Fragment>{items}</React.Fragment>
//     }
// }

class App extends React.Component {
    private radar: Radar;
    private configData: Map<number, any>;

    public componentDidMount(): void {
        this.radar = new Radar();
        // this.refreshConfig()
    }

    public refreshConfig = () => {
        this.radar.fetchConfig().then(this.handleConfig).catch(this.refreshConfig);
    }

    public handleConfig = (config) => {
        console.log(config);
    }

    public mapRef = React.createRef<MapNode>();
    public controlRef = React.createRef<LayersControl>();

    public state = {
        lat: defaultPosition[0],
        lng: defaultPosition[1],
        zoom: 12,
        sprites: [],
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
            console.log(res.sprite_list);
            if (res.sprite_list) {
                this.setState(() => {
                    return {
                        sprites: res.sprite_list,
                    };
                });
            }

        },
        ).catch(console.log);
    }

    public render() {
        // let orderMap = new Map<number, number>();
        // let sprite_groups: [[SpriteLocation]] = this.state.sprites.
        // reduce((dic: [[SpriteLocation]], sprite: SpriteLocation) => {
        //     if (orderMap.has(sprite.sprite_id)) {
        //         dic[orderMap.get(sprite.sprite_id)].push(sprite);
        //     } else {
        //         orderMap.set(sprite.sprite_id, dic.length);
        //         dic.push([sprite]);
        //     }
        //     return dic;
        // }, []);
        // console.log(sprite_groups);

        return (
            <MapNode center={defaultPosition}
                zoom={12}
                onViewportChanged={this.onViewportChanged}
                onClick={this.forceRequest}
            >
                {/*<MapControl createLeafletElement={} updateLeafletElement={}></MapControl>*/}
                <LayersControl position={"topright"}>
                    <BaseLayer checked name={"Base map"}>
                        <TileLayer
                            url={"http://rt{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0"}
                            subdomains={"0123"} tms={true} minZoom={3} />
                    </BaseLayer>
                    <Overlay checked name={"妖灵"}>
                        <LayerGroup>
                            {this.state.sprites.filter(filterYaoling).map((sprite: SpriteLocation) => (
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
                    {/*{*/}

                    {/*    sprite_groups.map((group) => (*/}

// tslint:disable-next-line: max-line-length
                    {/*        <Overlay key={group[0].sprite_id.toString()} checked name={SpriteConfig.get(group[0].sprite_id).Name}>*/}
                    {/*            */}
                    {/*        </Overlay>)*/}
                    {/*    )*/}
                    {/*}*/}
                </LayersControl>
            </MapNode>
        );
    }
}

export default App;
