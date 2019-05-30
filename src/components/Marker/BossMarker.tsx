import { BossLocation } from "@api/Radar";
import { Prefix, SpriteConfig } from "@config/SpriteData";
import { icon } from "leaflet";
import * as React from "react";
import { Marker, Popup } from "react-leaflet";

function stateString(state: number): string {
    switch (state) {
        case 0:
            return "正常";
        case 1:
            return "神石状态";
        case 2:
            return "战斗中";
    }
    return "";
}

export const BossMarker = ({ boss }: { boss: BossLocation }) => (
    <Marker position={{ lat: boss.latitude / 1e6, lng: boss.longtitude / 1e6 }}
        icon={icon({ iconUrl: Prefix + SpriteConfig.get(boss.bossid).SmallImgPath, iconSize: [32, 32] })}
    >
        <Popup>
            <div>{SpriteConfig.get(boss.bossid).Name}</div>
            <div>战力 {boss.bossfightpower}</div>
            <div>L {boss.bosslevel}</div>
            <div>{"★".repeat(boss.starlevel)}</div>
            <div>{stateString(boss.state)}</div>
            <div>{new Date(boss.freshtime * 1000).toLocaleTimeString()} 结束</div>
        </Popup>
    </Marker>
);
