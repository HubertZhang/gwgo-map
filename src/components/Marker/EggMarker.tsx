import { BossLocation } from "@api/Radar";
import { SpriteConfig } from "@config/SpriteData";
import { icon } from "leaflet";
import * as React from "react";
import { Marker, Popup } from "react-leaflet";

// tslint:disable: no-var-requires
const egg1 = require("./Images/egg1.png");
const egg2 = require("./Images/egg2.png");
const egg3 = require("./Images/egg3.png");
const egg4 = require("./Images/egg4.png");
const egg5 = require("./Images/egg5.png");

const eggs = [
    egg1, egg2, egg3, egg4, egg5,
];

export const EggMarker = ({ boss }: { boss: BossLocation }) => (
    <Marker position={{ lat: boss.latitude / 1e6, lng: boss.longtitude / 1e6 }}
        icon={icon({ iconUrl: eggs[boss.starlevel - 1], iconSize: [32, 32] })}
    >
        <Popup>
            <div>{"★".repeat(boss.starlevel)}</div>
            <div>{new Date(boss.freshtime * 1000).toLocaleTimeString()} 孵化</div>
        </Popup>
    </Marker>
);
