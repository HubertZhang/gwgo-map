import { ISpriteData, Prefix } from "@config/SpriteData";
import classnames from "classnames";
import * as React from "react";
import * as style from "./YaolingEntry.scss";

interface IYaolingEntry {
    sprite: ISpriteData;
    checked: boolean;
    onClick: any;
}

export default class YaolingEntry extends React.Component<IYaolingEntry> {
    public render() {
        const { sprite, checked, onClick } = this.props;
        return <div
            className={classnames({ [style.YaolingEntry]: true, [style.checked]: checked })}
            key={sprite.Id}
            onClick={() => onClick(sprite.Id)}
        >
            <img className={style.avatar} src={Prefix + sprite.SmallImgPath} />
            <p className={style.name}>{sprite.Name}</p>
            <p className={style.checkbox} hidden={!checked}>✔️</p>
        </div>;
    }
}
