import {SpriteLocation} from "@api/Radar";
import * as config from "./config.json";

interface ISpriteData {
    Name: string;
    FiveEle: string[];
    PrefabName: string;
    ImgName: string;
    BigImgPath: string;
    SmallImgPath: string;
    Level: number;
}

export const SpriteConfig = new Map<number, ISpriteData>();

config.Data.forEach((data) => {
    SpriteConfig.set(data.Id, data as ISpriteData);
});

const Yaolings = new Set(["树树鼠", "金角小妖", "小白蛇", "貂宝", "舞狮", "暴走小龙虾", "句芒", "风雪虎",
    "小毒蝎", "金灵童子", "小蝌蚪", "银灵童子", "香玉", "小蝙蝠", "咸鱼", "多鱼", "锦鲤", "摸鱼", "大若智鱼", "银角小妖",
    "羊秀才", "幼尾狐", "布鲁", "螺莉莉", "小龙人", "小兵俑", "麻将仔", "小安康", "麻辣小火锅", "柳依依", "颜如玉", "秋容"]);

const YaolingIDs = new Set();
SpriteConfig.forEach((sprite, id) => {
    if (Yaolings.has(sprite.Name)) {
        YaolingIDs.add(id);
    }
});

export function filterYaoling(sprite: SpriteLocation): boolean {
    return YaolingIDs.has(sprite.sprite_id);
}
