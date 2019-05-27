export function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}

export function jsonToPayload(obj: any) {
    const buffer = Buffer.from(JSON.stringify(obj));
    const l = buffer.length;
    const header = new ArrayBuffer(4); // an Int32 takes 4 bytes
    const headerView = new DataView(header);
    headerView.setUint32(0, l, false); // byteOffset = 0; litteEndian = false
    const payload = new Uint8Array(4 + l);
    payload.set(new Uint8Array(header), 0);
    payload.set(buffer, 4);
    return payload.buffer;
}
