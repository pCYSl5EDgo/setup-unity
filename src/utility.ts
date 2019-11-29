import * as jsdom from "jsdom";
import { default as request } from 'sync-request';

function GetIdInternal(path: string, start: number) {
    const html = request("GET", path).body;
    const dom = new jsdom.JSDOM(html);
    const div0 = dom.window.document.getElementsByClassName("faq").item(0) as HTMLDivElement;
    const div1 = div0.children.item(1) as HTMLDivElement;
    const p0 = div1.children.item(0) as HTMLParagraphElement;
    const a0 = p0.children.item(0) as HTMLAnchorElement;
    const href: String = a0.href;
    return href.substr(start, 12);
}

function GetIdFinal(major: number, minor: number, patch: number): string {
    const path = "https://unity3d.com/unity/whats-new/" + major.toString() + "." + minor.toString() + "." + patch.toString();
    return GetIdInternal(path, 44);
}

function GetIdAlpha(version: string): string {
    const path = "https://unity3d.com/unity/alpha/" + version;
    return GetIdInternal(path, 34);
}

function GetIdBeta(version: string): string {
    const path = "https://unity3d.com/unity/beta/" + version;
    return GetIdInternal(path, 34);
}

export function GetId(version: string): string {
    const splitVersion = version.split('.');
    const majorVersionStr = splitVersion[0];
    const majorVersionNum = Number.parseInt(majorVersionStr);
    if (majorVersionNum <= 2017) throw new Error(majorVersionStr + " should not be less than 2018");
    const patchVersionStr: String = splitVersion[2];

    if (patchVersionStr == '0f1') {
        return GetIdBeta(version);
    }

    const indexOfAlpha = patchVersionStr.indexOf("a");
    if (indexOfAlpha !== -1) return GetIdAlpha(version);
    const indexOfBeta = patchVersionStr.indexOf("b");
    if (indexOfBeta !== -1) return GetIdBeta(version);
    const minorVersionStr = splitVersion[1];
    const minorVersionNum = Number.parseInt(minorVersionStr);
    const indexOfFinal = patchVersionStr.indexOf("f");
    if (indexOfFinal === -1) throw new Error("invalid version");
    return GetIdFinal(majorVersionNum, minorVersionNum, Number.parseInt(patchVersionStr.substr(0, indexOfFinal)));
}