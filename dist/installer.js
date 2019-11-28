"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const exec = __importStar(require("@actions/exec"));
const cp = __importStar(require("child_process"));
function GetSha1Internal(path, start) {
    const html = sync_request_1.default("GET", path).body;
    const dom = new jsdom.JSDOM(html);
    const div0 = dom.window.document.getElementsByClassName("faq").item(0);
    const div1 = div0.children.item(1);
    const p0 = div1.children.item(0);
    const a0 = p0.children.item(0);
    const href = a0.href;
    return href.substr(start, 12);
}
function GetSha1Final(major, minor, patch) {
    const path = "https://unity3d.com/unity/whats-new/" + major.toString() + "." + minor.toString() + "." + patch.toString();
    return GetSha1Internal(path, 44);
}
function GetSha1Alpha(version) {
    const path = "https://unity3d.com/unity/alpha/" + version;
    return GetSha1Internal(path, 34);
}
function GetSha1Beta(version) {
    const path = "https://unity3d.com/unity/beta/" + version;
    return GetSha1Internal(path, 34);
}
function GetSha1(version) {
    const splitVersion = version.split('.');
    const majorVersionStr = splitVersion[0];
    const majorVersionNum = Number.parseInt(majorVersionStr);
    if (majorVersionNum <= 2017)
        throw new Error(majorVersionStr + " should not be less than 2018");
    const patchVersionStr = splitVersion[2];
    if (patchVersionStr == '0f1') {
        return GetSha1Beta(version);
    }
    const indexOfAlpha = patchVersionStr.indexOf("a");
    if (indexOfAlpha !== -1)
        return GetSha1Alpha(version);
    const indexOfBeta = patchVersionStr.indexOf("b");
    if (indexOfBeta !== -1)
        return GetSha1Beta(version);
    const minorVersionStr = splitVersion[1];
    const minorVersionNum = Number.parseInt(minorVersionStr);
    const indexOfFinal = patchVersionStr.indexOf("f");
    if (indexOfFinal === -1)
        throw new Error("invalid version");
    return GetSha1Final(majorVersionNum, minorVersionNum, Number.parseInt(patchVersionStr.substr(0, indexOfFinal)));
}
exports.GetSha1 = GetSha1;
function GetDownloadUrl(id) {
    switch (process.platform) {
        case "darwin":
            return "https://beta.unity3d.com/download/" + id + "/MacEditorInstaller/Unity.pkg";
        case "win32":
            return "https://beta.unity3d.com/download/" + id + "/Windows64EditorInstaller/UnitySetup64.exe";
        default:
            return "https://beta.unity3d.com/download/" + id + "/UnitySetup";
    }
}
exports.GetDownloadUrl = GetDownloadUrl;
function GetSupportDownloadUrl(id) {
    switch (process.platform) {
        case "darwin":
            return "https://beta.unity3d.com/download/" + id + "/MacEditorTargetInstaller/";
        case "win32":
            return "https://beta.unity3d.com/download/" + id + "/TargetSupportInstaller/";
        default:
            return "https://beta.unity3d.com/download/" + id + "/LinuxEditorTargetInstaller/";
    }
}
function ExecuteSetUp(download_url, version) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (process.platform) {
            case "win32":
                //await exec.exec('Invoke-WebRequest -Uri ' + download_url + ' -OutFile ./UnitySetup64.exe');
                // なんてことだ！
                // 信じられない！
                // 上記のInvoke-WebRequestにすると2018.3.7f1をダウンロードしてくるのだ。
                // Unity2020を要求しているのにも関わらず！
                // しょうがないからbitsadminする他無い！            
                cp.execSync('bitsadmin /TRANSFER bj /download /priority foreground ' + download_url + ' %CD%\\UnitySetup64.exe');
                cp.execSync('UnitySetup64.exe /UI=reduced /S /D=C:\\Program Files\\Unity');
                break;
            case "darwin":
                yield exec.exec('curl -OL ' + download_url);
                yield exec.exec("sudo installer -package Unity.pkg -target /");
                break;
            default:
                cp.execSync('sudo apt-get update');
                cp.execSync('sudo apt-get -y install gconf-service');
                cp.execSync('sudo apt-get -y install lib32gcc1');
                cp.execSync('sudo apt-get -y install lib32stdc++6');
                cp.execSync('sudo apt-get -y install libasound2');
                cp.execSync('sudo apt-get -y install libc6');
                cp.execSync('sudo apt-get -y install libc6-i386');
                cp.execSync('sudo apt-get -y install libcairo2');
                cp.execSync('sudo apt-get -y install libcap2');
                cp.execSync('sudo apt-get -y install libcups2');
                cp.execSync('sudo apt-get -y install libdbus-1-3');
                cp.execSync('sudo apt-get -y install libexpat1');
                cp.execSync('sudo apt-get -y install libfontconfig1');
                cp.execSync('sudo apt-get -y install libfreetype6');
                cp.execSync('sudo apt-get -y install libgcc1');
                cp.execSync('sudo apt-get -y install libgconf-2-4');
                cp.execSync('sudo apt-get -y install libgdk-pixbuf2.0-0');
                cp.execSync('sudo apt-get -y install libgl1-mesa-glx');
                cp.execSync('sudo apt-get -y install libglib2.0-0');
                cp.execSync('sudo apt-get -y install libglu1-mesa');
                cp.execSync('sudo apt-get -y install libgtk2.0-0');
                cp.execSync('sudo apt-get -y install libnspr4');
                cp.execSync('sudo apt-get -y install libnss3');
                cp.execSync('sudo apt-get -y install libpango1.0-0');
                cp.execSync('sudo apt-get -y install libstdc++6');
                cp.execSync('sudo apt-get -y install libx11-6');
                cp.execSync('sudo apt-get -y install libxcomposite1');
                cp.execSync('sudo apt-get -y install libxcursor1');
                cp.execSync('sudo apt-get -y install libxdamage1');
                cp.execSync('sudo apt-get -y install libxext6');
                cp.execSync('sudo apt-get -y install libxfixes3');
                cp.execSync('sudo apt-get -y install libxi6');
                cp.execSync('sudo apt-get -y install libxrandr2');
                cp.execSync('sudo apt-get -y install libxrender1');
                cp.execSync('sudo apt-get -y install libxtst6');
                cp.execSync('sudo apt-get -y install zlib1g');
                cp.execSync('sudo apt-get -y install npm');
                cp.execSync('sudo apt-get -y install debconf');
                //cp.execSync('sudo apt-get -y install libpq5');
                yield exec.exec('wget ' + download_url + ' -O UnitySetUp');
                yield exec.exec('sudo chmod +x UnitySetUp');
                cp.execSync('echo y | ./UnitySetUp --unattended --install-location="/opt/Unity-' + version + '"');
                cp.execSync('mv /opt/Unity-' + version + '/ /opt/Unity/');
                yield exec.exec('sudo rm -f UnitySetUp');
                break;
        }
    });
}
exports.ExecuteSetUp = ExecuteSetUp;
