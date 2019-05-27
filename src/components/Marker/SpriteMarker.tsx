import * as React from "react";

import { Prefix, SpriteConfig } from "@config/SpriteData";
import { icon } from "leaflet";
import { Marker, Popup } from "react-leaflet";

export const SpriteMarker = ({ sprite: sprite }) => (
    <Marker position={{ lat: sprite.latitude / 1e6, lng: sprite.longtitude / 1e6 }}
        icon={icon({
            iconUrl: Prefix + SpriteConfig.get(sprite.sprite_id).SmallImgPath,
            iconSize: [32, 32],
        })}>
        <Popup>
            <p>{(new Date((sprite.gentime + sprite.lifetime) * 1000)).toLocaleTimeString()}</p>
        </Popup>
    </Marker>
);
