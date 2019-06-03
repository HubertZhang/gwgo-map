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

export const CommonSpriteID = [2000001, 2000004, 2000013, 2000022, 2000025,
    2000034, 2000037, 2000046, 2000055, 2000061, 2000075, 2000103, 2000156,
    2000161, 2000164, 2000167, 2000170, 2000173, 2000176, 2000179, 2000185,
    2000194, 2000200, 2000209, 2000215, 2000218, 2000221, 2000232, 2000235,
    2000247, 2000511, 2000512, 2000513, 2000514, 2000515, 2004019, 2004022,
    2004023, 2004024, 2004025];
