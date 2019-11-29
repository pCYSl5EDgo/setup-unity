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
Object.defineProperty(exports, "__esModule", { value: true });
const utility_1 = require("../utility");
const exec = __importStar(require("@actions/exec"));
const cp = __importStar(require("child_process"));
class LinuxInstaller {
    GetId(version) {
        if (this.version === version) {
            if (this.id)
                return this.id;
            return this.id = utility_1.GetId(version);
        }
        this.version = version;
        return this.id = utility_1.GetId(version);
    }
    ExecuteSetUp(version) {
        return __awaiter(this, void 0, void 0, function* () {
            const download_url = "https://beta.unity3d.com/download/" + utility_1.GetId(version) + "/UnitySetup";
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
        });
    }
}
exports.LinuxInstaller = LinuxInstaller;
