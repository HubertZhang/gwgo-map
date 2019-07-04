import { getRandomInt, jsonToPayload } from "./util";

interface IWSRequest {
    request_type: string;
    requestid: number;
}

interface IWSResponse {
    requestid: number;
    retcode: number;
    retmsg: string;
}

interface ISpriteResponse extends IWSResponse {
    sprite_list: [ISpriteLocation];
}

interface IDojoResponse extends IWSResponse {
    dojo_list: [IDojoLocation | IBossLocation];
}

interface ISpriteLocation {
    gentime: number;
    latitude: number;
    lifetime: number;
    longtitude: number;
    sprite_id: number;
}

interface IDojoLocation {
    latitude: number;
    longtitude: number;
    state: number;
    winner_name: string;
    winner_fightpower: number;
    sprite_list: Array<{ fightpower: number, level: number, spriteid: number }>;
}

interface IBossLocation {
    latitude: number;
    longtitude: number;
    state: number;
    bossfightpower: number;
    bossid: number;
    bosslevel: number;
    freshtime: number;
    starlevel: number;
}

interface IRadarConfig {
    filename: string;
}

class Radar {
    private connection: WebSocket;
    private requestResolvers: Map<number, (value?: any) => void>;
    private requestRejectors: Map<number, (reason?: any) => void>;
    private pendingRequestData: any[];

    constructor() {
        this.requestResolvers = new Map();
        this.requestRejectors = new Map();
        this.pendingRequestData = [];
        this.initSocket();
    }

    public static _generateRequestID() {
        return getRandomInt(1000000);
    }

    public initSocket() {
        this.connection = new WebSocket("wss://publicld.gwgo.qq.com?account_value=0&account_type=1&appid=0&token=0");
        // this._connection.open();
        this.connection.onopen = this._onSocketOpen.bind(this);
        this.connection.onerror = this._onSocketError.bind(this);
        this.connection.onclose = this._onSocketClose.bind(this);
        this.connection.onmessage = this._onSocketMessage.bind(this);
    }

    public _onSocketOpen(event: any) {
        console.log("Connection open ...");
        if (this.pendingRequestData.length > 0) {
            for (const data of this.pendingRequestData) {
                this.connection.send(jsonToPayload(data));
            }
            this.pendingRequestData = [];
        }
    }

    public _onSocketError(event: any) {
        console.log("Connection encountered error:", event);
    }

    public _onSocketClose(event: any) {
        console.log("Connection closed");
        this.initSocket();

    }

    public _onSocketMessage(event: MessageEvent) {
        const data = event.data;
        if (typeof (data) === "string") {
            console.log("String message: ", data);
            // } else if (typeof blob === "Buffer") {
            //
        } else {
            console.log("Blob message");
            const blob = data as Blob;
            (new Response(blob.slice(4))).text().then(
                (text) => {
                    const obj = JSON.parse(text);
                    const requestID = obj.requestid;
                    if (requestID && this.requestResolvers.has(requestID)) {
                        this.requestResolvers.get(requestID)(obj);
                        this.requestResolvers.delete(requestID);
                        this.requestRejectors.delete(requestID);
                    }
                },
            );
        }
    }

    public async sendMessage(request: any & IWSRequest) {
        const requestID = Radar._generateRequestID();
        let outerResolve: (value?: {} | PromiseLike<{}>) => void;
        let outerReject: (reason?: any) => void;
        const p = new Promise((resolve, reject) => {
            outerResolve = resolve;
            outerReject = reject;
        });
        this.requestResolvers.set(requestID, outerResolve);
        this.requestRejectors.set(requestID, outerReject);
        setTimeout((radar: Radar, id) => {
            if (radar.requestResolvers.has(id)) {
                radar.requestRejectors.get(id)("timeout");
                radar.requestResolvers.delete(id);
                radar.requestRejectors.delete(id);
            }
        }, 1000, this, requestID);
        const newRequest = request;
        newRequest.requestid = requestID;

        if (this.connection.readyState !== WebSocket.OPEN) {
            this.pendingRequestData.push(newRequest);
            return p;
        }

        this.connection.send(jsonToPayload(newRequest));
        return p;
    }

    public async fetchConfig() {
        return this.sendMessage({
            request_type: "1004",
            cfg_type: 1,
            platform: 0,
        }).then((config: IRadarConfig) => {
            console.log(config);
            if (!config.filename) {
                throw new Error("no config");
            }
            return fetch("https://hy.gwgo.qq.com/sync/pet/config/" + config.filename, { mode: "no-cors" });
        }).then((r: Response) => {
            return r.text();
        }).then(JSON.parse);
    }

    public async fetchYaolings(lat: number, lng: number): Promise<ISpriteResponse> {
        return this.sendMessage({
            request_type: "1001",
            longtitude: Math.round(lng * 1E6),
            latitude: Math.round(lat * 1E6),
            platform: 0,
        }).then((res) => (res as ISpriteResponse));
    }

    public async fetchDojos(lat: number, lng: number): Promise<IDojoResponse> {
        return this.sendMessage({
            request_type: "1002",
            longtitude: Math.round(lng * 1E6),
            latitude: Math.round(lat * 1E6),
            platform: 0,
        }).then((res) => (res as IDojoResponse));
    }
}

export {
    IWSResponse as WSResponse,
    ISpriteResponse as SpriteResponse,
    IDojoResponse as DojoResponse,
    IBossLocation as BossLocation,
    ISpriteLocation as SpriteLocation,
    IDojoLocation as DojoLocation,
};

export default Radar;
