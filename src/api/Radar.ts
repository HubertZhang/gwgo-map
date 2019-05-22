function abc1(e) {
    const n = new ArrayBuffer(2 * e.length);
    const r = new Uint16Array(n);
    for (let t = 0; t < e.length; t++) { r[t] = e.charCodeAt(t); }
    return r;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function json2buffer(n) {
    const r = abc1(JSON.stringify(n));
    const t = r.length;
    const o = new ArrayBuffer(4);
    new DataView(o).setUint32(0, t);
    const s = new Uint8Array(4 + t);
    s.set(new Uint8Array(o), 0);
    s.set(r, 4);
    return s.buffer;
}

interface IWSResponse {
    requestid: number;
    retcode: number;
    retmsg: string;
}

interface ISpriteResponse extends IWSResponse {
    sprite_list: [ISpriteLocation];
}

interface ISpriteLocation {
    gentime: number;
    latitude: number;
    lifetime: number;
    longtitude: number;
    sprite_id: number;
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
        this.connection = new WebSocket("wss://publicld.gwgo.qq.com?account_value=0&account_type=0&appid=0&token=0");
        // this._connection.open();
        this.connection.onopen = this._onSocketOpen.bind(this);
        this.connection.onerror = this._onSocketError.bind(this);
        this.connection.onclose = this._onSocketClose.bind(this);
        this.connection.onmessage = this._onSocketMessage.bind(this);
    }

    public _onSocketOpen(event) {
        console.log("Connection open ...");
        if (this.pendingRequestData.length > 0) {
            for (const data of this.pendingRequestData) {
                this.connection.send(json2buffer(data));
            }
            this.pendingRequestData = [];
        }
    }

    public _onSocketError(event) {
        console.log("Connection encountered error:", event);
    }

    public _onSocketClose(event) {
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

    public async sendMessage(request) {
        const requestID = Radar._generateRequestID();
        let outerResolve;
        let outerReject;
        const p = new Promise((resolve, reject) => {
            outerResolve = resolve;
            outerReject = reject;
        });
        this.requestResolvers.set(requestID, outerResolve);
        this.requestRejectors.set(requestID, outerReject);
        setTimeout((radar, id) => {
            if (radar._requestResolvers.has(id)) {
                radar._requestRejectors.get(id)("timeout");
                radar._requestResolvers.delete(id);
                radar._requestRejectors.delete(id);
            }
        }, 1000, this, requestID);
        const newRequest = request;
        newRequest.requestid = requestID;

        if (this.connection.readyState !== WebSocket.OPEN) {
            this.pendingRequestData.push(newRequest);
            return p;
        }

        this.connection.send(json2buffer(newRequest));
        return p;
    }

    public async fetchConfig() {
        return this.sendMessage({
            request_type: "1004",
            cfg_type: 1,
            platform: 0,
        }).then((config: IRadarConfig) => {
            if (!config.filename) {
                throw new Error("no config");
            }
            return fetch("https://hy.gwgo.qq.com/sync/pet/config/" + config.filename, {mode: "no-cors"});
        }).then((r: Response) => {
            return r.text();
        }).then(JSON.parse);
    }

    public async fetchYaolings(lat, lng): Promise<ISpriteResponse> {
        return this.sendMessage({
            request_type: "1001",
            longtitude: Math.round(lng * 1E6),
            latitude: Math.round(lat * 1E6),
            platform: 0,
        }).then((res) => (res as ISpriteResponse));
    }
}

export {ISpriteResponse as SpriteResponse, IWSResponse as WSResponse, ISpriteLocation as SpriteLocation};

export default Radar;
