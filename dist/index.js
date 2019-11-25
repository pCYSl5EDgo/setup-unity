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
var tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';
var core = __importStar(require("@actions/core"));
var path = __importStar(require("path"));
var jsdom = __importStar(require("jsdom"));
var sync_request_1 = __importDefault(require("sync-request"));
var fs = __importStar(require("fs"));
var child_process_1 = require("child_process");
var IS_WINDOWS = process.platform === 'win32';
if (!tempDirectory) {
    var baseLocation = void 0;
    if (IS_WINDOWS) {
        // On windows use the USERPROFILE env variable
        baseLocation = process.env['USERPROFILE'] || 'C:\\';
    }
    else {
        if (process.platform === 'darwin') {
            baseLocation = '/Users';
        }
        else {
            baseLocation = '/home';
        }
    }
    tempDirectory = path.join(baseLocation, 'actions', 'temp');
}
function GetSha1Final(major, minor, patch) {
    var path = "https://unity3d.com/unity/whats-new/" + major.toString() + "." + minor.toString() + "." + patch.toString();
    core.warning("path\n" + path);
    var html = sync_request_1.default("GET", path).body;
    //core.warning("html\n" + html.toString());
    var dom = new jsdom.JSDOM(html);
    core.warning("faq count\n" + dom.window.document.getElementsByClassName("faq").length);
    var div0 = dom.window.document.getElementsByClassName("faq").item(0);
    //core.warning("div0\n" + div0.innerHTML);
    var a0 = div0.childNodes.item(1);
    core.debug(a0.tagName);
    var href0 = a0.attributes.getNamedItem("href");
    if (!href0 || !href0.textContent) {
        throw new Error("null href");
    }
    core.warning("href0\n" + href0.textContent);
    return href0.textContent.substr(44, 12);
}
function GetSha1Alpha(version) {
    var html = sync_request_1.default("GET", "https://unity3d.com/unity/alpha/" + version).body;
    var dom = new jsdom.JSDOM(html);
    var div0 = dom.window.document.getElementsByClassName("faq").item(0);
    var p0 = div0.childNodes.item(1);
    var a0 = p0.childNodes.item(0);
    var href = a0.href;
    return href.substr(34, 12);
}
function GetSha1Beta(version) {
    var html = sync_request_1.default("GET", "https://unity3d.com/unity/beta/" + version).body;
    var dom = new jsdom.JSDOM(html);
    var div0 = dom.window.document.getElementsByClassName("faq").item(0);
    var p0 = div0.childNodes.item(1);
    var a0 = p0.children.item(0);
    var href = a0.href;
    return href.substr(34, 12);
}
function GetSha1(version) {
    var splitVersion = version.split('.');
    var majorVersionStr = splitVersion[0];
    var majorVersionNum = Number.parseInt(majorVersionStr);
    if (majorVersionNum < 2017)
        throw new Error(majorVersionStr + " should not be less than 2017");
    var patchVersionStr = splitVersion[2];
    var indexOfAlpha = patchVersionStr.indexOf("a");
    if (indexOfAlpha !== -1)
        return GetSha1Alpha(version);
    var indexOfBeta = patchVersionStr.indexOf("b");
    if (indexOfBeta !== -1)
        return GetSha1Beta(version);
    var minorVersionStr = splitVersion[1];
    var minorVersionNum = Number.parseInt(minorVersionStr);
    var indexOfFinal = patchVersionStr.indexOf("f");
    if (indexOfFinal === -1)
        throw new Error("invalid version");
    return GetSha1Final(majorVersionNum, minorVersionNum, Number.parseInt(patchVersionStr.substr(0, indexOfFinal)));
}
function GetSetUpName() {
    switch (process.platform) {
        case "darwin":
            return "SetUp.pkg";
        case "win32":
            return "SetUp.exe";
        default:
            return "SetUp";
    }
}
function GetDownloadUrl(sha1) {
    switch (process.platform) {
        case "darwin":
            return "https://beta.unity3d.com/download/" + sha1 + "/MacEditorInstaller/Unity.pkg";
        case "win32":
            return "https://beta.unity3d.com/download/" + sha1 + "/Windows64EditorInstaller/UnitySetup64.exe";
        default:
            return "https://beta.unity3d.com/download/" + sha1 + "/UnitySetup";
    }
}
function ExecuteSetUp() {
    switch (process.platform) {
        case "win32":
            child_process_1.execSync('UnitySetup64.exe /S /D="C:\Program Files\Unity"');
            break;
        case "darwin":
            child_process_1.execSync("sudo installer -package Unity.pkg -target /");
            break;
        default:
            child_process_1.execSync('sudo chmod +x UnitySetup && echo y | ./UnitySetUp --unattended --install-location=/opt/Unity --verbose --download-location=/tmp/unity --components=Unity && sudo rm UnitySetUp && sudo rm -rf /tmp/unity && sudo rm -rf /root/.local/share/Trash/*');
            break;
    }
}
function Run() {
    var version = core.getInput("unity-version", { required: true });
    var sha1 = GetSha1(version);
    var download_url = GetDownloadUrl(sha1);
    fs.writeFileSync(GetSetUpName(), sync_request_1.default("GET", download_url));
    ExecuteSetUp();
}
Run();
