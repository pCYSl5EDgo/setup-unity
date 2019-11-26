let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';

import * as core from '@actions/core';
import * as path from 'path';
import * as jsdom from "jsdom";
import { default as request } from 'sync-request';
import * as exec from '@actions/exec';
import * as cp from 'child_process';

const IS_WINDOWS = process.platform === 'win32';

if (!tempDirectory) {
    let baseLocation;
    if (IS_WINDOWS) {
        // On windows use the USERPROFILE env variable
        baseLocation = process.env['USERPROFILE'] || 'C:\\';
    } else {
        if (process.platform === 'darwin') {
            baseLocation = '/Users';
        } else {
            baseLocation = '/home';
        }
    }
    tempDirectory = path.join(baseLocation, 'actions', 'temp');
}

function GetSha1Internal(path: string, start: number) {
    const html = request("GET", path).body;
    const dom = new jsdom.JSDOM(html);
    const div0 = dom.window.document.getElementsByClassName("faq").item(0) as HTMLDivElement;
    const div1 = div0.children.item(1) as HTMLDivElement;
    const p0 = div1.children.item(0) as HTMLParagraphElement;
    const a0 = p0.children.item(0) as HTMLAnchorElement;
    const href: String = a0.href;
    return href.substr(start, 12);
}

function GetSha1Final(major: number, minor: number, patch: number): string {
    const path = "https://unity3d.com/unity/whats-new/" + major.toString() + "." + minor.toString() + "." + patch.toString();
    return GetSha1Internal(path, 44);
}

function GetSha1Alpha(version: string): string {
    const path = "https://unity3d.com/unity/alpha/" + version;
    return GetSha1Internal(path, 34);
}

function GetSha1Beta(version: string): string {
    const path = "https://unity3d.com/unity/beta/" + version;
    return GetSha1Internal(path, 34);
}

function GetSha1(version: string): string {
    const splitVersion = version.split('.');
    const majorVersionStr = splitVersion[0];
    const majorVersionNum = Number.parseInt(majorVersionStr);
    if (majorVersionNum < 2017) throw new Error(majorVersionStr + " should not be less than 2017");
    const patchVersionStr: String = splitVersion[2];

    const indexOfAlpha = patchVersionStr.indexOf("a");
    if (indexOfAlpha !== -1) return GetSha1Alpha(version);
    const indexOfBeta = patchVersionStr.indexOf("b");
    if (indexOfBeta !== -1) return GetSha1Beta(version);
    const minorVersionStr = splitVersion[1];
    const minorVersionNum = Number.parseInt(minorVersionStr);
    const indexOfFinal = patchVersionStr.indexOf("f");
    if (indexOfFinal === -1) throw new Error("invalid version");
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

function GetDownloadUrl(sha1: string): string {
    switch (process.platform) {
        case "darwin":
            return "https://beta.unity3d.com/download/" + sha1 + "/MacEditorInstaller/Unity.pkg";
        case "win32":
            return "https://beta.unity3d.com/download/" + sha1 + "/Windows64EditorInstaller/UnitySetup64.exe";
        default:
            return "https://beta.unity3d.com/download/" + sha1 + "/UnitySetup";
    }
}

async function ExecuteSetUp(download_url: string, version: string) {
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
            await exec.exec('curl -OL ' + download_url)
            await exec.exec("sudo installer -package Unity.pkg -target /");
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
            await exec.exec('wget ' + download_url + ' -O UnitySetUp');
            await exec.exec('sudo chmod +x UnitySetUp');
            cp.execSync('echo y | ./UnitySetUp --unattended --install-location="/opt/Unity-' + version + '"');
            cp.execSync('mv /opt/Unity-' + version + '/ /opt/Unity/');
            await exec.exec('sudo rm -f UnitySetUp');
            break;
    }
}

async function Run() {
    const version = core.getInput("unity-version", { required: true });
    const sha1 = GetSha1(version);
    core.setOutput("id", sha1);
    const download_url = GetDownloadUrl(sha1);
    await ExecuteSetUp(download_url, version);
}

Run();