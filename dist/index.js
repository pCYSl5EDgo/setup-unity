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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';
var core = __importStar(require("@actions/core"));
var path = __importStar(require("path"));
var jsdom = __importStar(require("jsdom"));
var sync_request_1 = __importDefault(require("sync-request"));
var fs = __importStar(require("fs"));
var exec = __importStar(require("@actions/exec"));
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
function GetSha1Internal(path, start) {
    var html = sync_request_1.default("GET", path).body;
    var dom = new jsdom.JSDOM(html);
    var div0 = dom.window.document.getElementsByClassName("faq").item(0);
    var div1 = div0.children.item(1);
    var p0 = div1.children.item(0);
    var a0 = p0.children.item(0);
    var href = a0.href;
    return href.substr(start, 12);
}
function GetSha1Final(major, minor, patch) {
    var path = "https://unity3d.com/unity/whats-new/" + major.toString() + "." + minor.toString() + "." + patch.toString();
    return GetSha1Internal(path, 44);
}
function GetSha1Alpha(version) {
    var path = "https://unity3d.com/unity/alpha/" + version;
    return GetSha1Internal(path, 34);
}
function GetSha1Beta(version) {
    var path = "https://unity3d.com/unity/beta/" + version;
    return GetSha1Internal(path, 34);
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
            return "Unity.pkg";
        case "win32":
            return "UnitySetup64.exe";
        default:
            return "UnitySetUp";
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
function ExecuteSetUp(download_url) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = process.platform;
                    switch (_a) {
                        case "win32": return [3 /*break*/, 1];
                        case "darwin": return [3 /*break*/, 4];
                    }
                    return [3 /*break*/, 7];
                case 1: return [4 /*yield*/, exec.exec('Invoke-WebRequest -Uri ' + download_url + ' -OutFile UnitySetup64.exe')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, exec.exec('UnitySetup64.exe /S /D="C:\Program Files\Unity"')];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 4: return [4 /*yield*/, exec.exec('curl -OL ' + download_url)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, exec.exec("sudo installer -package Unity.pkg -target /")];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 7: 
                //await exec.exec('sudo apt-get update');
                //await exec.exec('sudo apt-get -y install libgtk-3-dev libglu1-mesa libxi-dev libxmu-dev libglu1-mesa-dev libnss3-dev libsound2-dev libgconf2-dev');
                return [4 /*yield*/, exec.exec('wget ' + download_url + ' -O UnitySetUp')];
                case 8:
                    //await exec.exec('sudo apt-get update');
                    //await exec.exec('sudo apt-get -y install libgtk-3-dev libglu1-mesa libxi-dev libxmu-dev libglu1-mesa-dev libnss3-dev libsound2-dev libgconf2-dev');
                    _b.sent();
                    return [4 /*yield*/, exec.exec('sudo chmod +x UnitySetUp')];
                case 9:
                    _b.sent();
                    fs.writeFileSync('tmp_a.txt', "y\n");
                    return [4 /*yield*/, exec.exec('cat tmp_a.txt')];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, exec.exec('echo -n < tmp_a.txt')];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, exec.exec('./UnitySetUp --unattended --install-location=/opt/Unity --verbose --download-location=/tmp/unity --components=Unity < tmp_a.txt')];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, exec.exec('rm tmp_a.txt')];
                case 13:
                    _b.sent();
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
function Run() {
    return __awaiter(this, void 0, void 0, function () {
        var version, sha1, download_url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    version = core.getInput("unity-version", { required: true });
                    sha1 = GetSha1(version);
                    download_url = GetDownloadUrl(sha1);
                    return [4 /*yield*/, ExecuteSetUp(download_url)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
Run();
