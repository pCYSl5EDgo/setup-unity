"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsdom = __importStar(require("jsdom"));
const sync_request_1 = __importDefault(require("sync-request"));
function GetIdInternal(path, start) {
    const html = sync_request_1.default("GET", path).body;
    const dom = new jsdom.JSDOM(html);
    const div0 = dom.window.document.getElementsByClassName("faq").item(0);
    const div1 = div0.children.item(1);
    const p0 = div1.children.item(0);
    const a0 = p0.children.item(0);
    const href = a0.href;
    return href.substr(start, 12);
}
function GetIdFinal(major, minor, patch) {
    const path = "https://unity3d.com/unity/whats-new/" + major.toString() + "." + minor.toString() + "." + patch.toString();
    return GetIdInternal(path, 44);
}
function GetIdAlpha(version) {
    const path = "https://unity3d.com/unity/alpha/" + version;
    return GetIdInternal(path, 34);
}
function GetIdBeta(version) {
    const path = "https://unity3d.com/unity/beta/" + version;
    return GetIdInternal(path, 34);
}
function GetId(version) {
    const splitVersion = version.split('.');
    const majorVersionStr = splitVersion[0];
    const majorVersionNum = Number.parseInt(majorVersionStr);
    if (majorVersionNum <= 2017)
        throw new Error(majorVersionStr + " should not be less than 2018");
    const patchVersionStr = splitVersion[2];
    if (patchVersionStr == '0f1') {
        return GetIdBeta(version);
    }
    const indexOfAlpha = patchVersionStr.indexOf("a");
    if (indexOfAlpha !== -1)
        return GetIdAlpha(version);
    const indexOfBeta = patchVersionStr.indexOf("b");
    if (indexOfBeta !== -1)
        return GetIdBeta(version);
    const minorVersionStr = splitVersion[1];
    const minorVersionNum = Number.parseInt(minorVersionStr);
    const indexOfFinal = patchVersionStr.indexOf("f");
    if (indexOfFinal === -1)
        throw new Error("invalid version");
    return GetIdFinal(majorVersionNum, minorVersionNum, Number.parseInt(patchVersionStr.substr(0, indexOfFinal)));
}
exports.GetId = GetId;
