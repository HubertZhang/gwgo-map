import Radar, { BossLocation, DojoLocation, DojoResponse, SpriteLocation, SpriteResponse } from "./Radar";

interface IRange {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
}

export class SpriteDataSource {
    private radar: Radar;
    private yaolingRange: IRange;
    private dojoRange: IRange;

    private yaolings: [SpriteLocation];
    private dojos: [DojoLocation | BossLocation];

    constructor() {
        this.radar = new Radar();
    }

    /**
     * fetchYaolingByCenter
     */
    public async fetchYaolingByCenter(lat: number, lng: number) {
        const latE6 = lat * 1E6;
        const lngE6 = lng * 1E6;
        if (this.yaolings == null ||
            latE6 < this.yaolingRange.minLat + 1500 ||
            latE6 > this.yaolingRange.maxLat - 1500 ||
            lngE6 < this.yaolingRange.minLng + 1500 ||
            lngE6 > this.yaolingRange.maxLng - 1500) {
            return this.radar.fetchYaolings(lat, lng).then((res: SpriteResponse) => {
                if (res.sprite_list) {
                    let minLat = Number.MAX_VALUE;
                    let maxLat = 0;
                    let minLng = Number.MAX_VALUE;
                    let maxLng = 0;
                    for (const s of res.sprite_list) {
                        minLat = Math.min(minLat, s.latitude);
                        maxLat = Math.max(maxLat, s.latitude);
                        minLng = Math.min(minLng, s.longtitude);
                        maxLng = Math.max(maxLng, s.longtitude);
                    }
                    this.yaolingRange = { minLat, maxLat, minLng, maxLng };
                    this.yaolings = res.sprite_list;
                    return this.yaolings;
                } else {
                    Promise.reject("Error Data");
                }
            });
        }

        return this.yaolings;
    }

    /**
     * fetchDojoByCenter
     */
    public async fetchDojoByCenter(lat: number, lng: number) {
        const latE6 = lat * 1E6;
        const lngE6 = lng * 1E6;
        if (this.dojos == null ||
            latE6 < this.dojoRange.minLat + 3000 ||
            latE6 > this.dojoRange.maxLat - 3000 ||
            lngE6 < this.dojoRange.minLng + 3000 ||
            lngE6 > this.dojoRange.maxLng - 3000) {
            return this.radar.fetchDojos(lat, lng).then((res: DojoResponse) => {
                if (res.dojo_list) {
                    let minLat = Number.MAX_VALUE;
                    let maxLat = 0;
                    let minLng = Number.MAX_VALUE;
                    let maxLng = 0;
                    for (const s of res.dojo_list) {
                        minLat = Math.min(minLat, s.latitude);
                        maxLat = Math.max(maxLat, s.latitude);
                        minLng = Math.min(minLng, s.longtitude);
                        maxLng = Math.max(maxLng, s.longtitude);
                    }
                    this.dojoRange = { minLat, maxLat, minLng, maxLng };
                    this.dojos = res.dojo_list;
                    return this.dojos;
                } else {
                    Promise.reject("Error Data");
                }

            });
        }
        return this.dojos;
    }
}
