import { DojoLocation } from "@api/Radar";
import { Prefix, SpriteConfig } from "@config/SpriteData";
import { icon } from "leaflet";
import * as React from "react";
import { Marker, Popup } from "react-leaflet";
import * as style from "./DojoMarker.scss";

const leitai = require("./Images/leitai.png");

const SpritePower = ({ dojo_sprite }: { dojo_sprite: { fightpower: number, level: number, spriteid: number } }) => (
    <div>
        <figure>
            <img src={Prefix + SpriteConfig.get(dojo_sprite.spriteid).SmallImgPath}></img>
            <figcaption>{dojo_sprite.fightpower}</figcaption>
        </figure>
    </div>
);

export const DojoMarker = ({ dojo }: { dojo: DojoLocation }) => (
    <Marker position={{ lat: dojo.latitude / 1e6, lng: dojo.longtitude / 1e6 }}
        icon={icon({ iconUrl: leitai, iconSize: [32, 32] })}>
        <Popup>
            <div className={style.popup}>
                <div className={style.owner}>
                    <div className={style["owner-name"]}>
                        {dojo.winner_name}占领
                    </div>
                    <div className={style["owner-power"]}>
                        总战力：{dojo.winner_fightpower}
                    </div>
                </div>
                <div className={style.sprites}>
                    {dojo.sprite_list.map((r, i) => (<SpritePower key={i} dojo_sprite={r} />))}
                </div>
            </div>
        </Popup>
    </Marker>
);
