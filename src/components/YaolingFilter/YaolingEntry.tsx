import { ISpriteData, Prefix } from "@config/SpriteData";
import * as React from "react";
import * as style from "./YaolingEntry.scss";

export default class YaolingEntry extends React.Component<{ sprite: ISpriteData, checked: boolean, onClick: any }> {
    public render() {
        const { sprite, checked, onClick } = this.props;
        return <li className={style.YaolingEntry} key={sprite.Id} onClick={() => onClick(sprite.Id)} >
                <img className={style.avatar} src={Prefix + sprite.SmallImgPath} />
                <p className={style.name}>{sprite.Name}</p>
                <p className={style.checkbox} hidden={!checked}>✔️</p>
        </li>;
    }
}
