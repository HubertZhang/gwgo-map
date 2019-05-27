import * as config from "@config/config.json";

export const Prefix = "https://hy.gwgo.qq.com/sync/pet/";

export interface ISpriteData {
    Id: number;
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
