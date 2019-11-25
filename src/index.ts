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
    const href:String = a0.href;
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
    const patchVersionStr:String = splitVersion[2];

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

async function ExecuteSetUp(download_url:string) {
    switch (process.platform) {
        case "win32":
            await exec.exec('Invoke-WebRequest -Uri ' + download_url + ' -OutFile UnitySetup64.exe');
            await exec.exec('UnitySetup64.exe /S /D="C:\Program Files\Unity"');
            break;
        case "darwin":
            await exec.exec('curl -OL ' + download_url)
            await exec.exec("sudo installer -package Unity.pkg -target /");
            break;
        default:
            cp.execSync('sudo apt-get update'
            + ' && ' + 
            'sudo apt-get upgrade');
            cp.execSync('sudo apt-get -y install gconf-service lib32gcc1 lib32stdc++6 libasound2 libc6 libc6-i386 libcairo2 libcap2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libfreetype6 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libgl1-mesa-glx libglib2.0-0 libglu1-mesa libgtk2.0-0 libnspr4 libnss3 libpango1.0-0 libstdc++6 libx11-6 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxtst6 zlib1g debconf npm libpq');
            await exec.exec('wget ' + download_url + ' -O UnitySetUp');
            await exec.exec('sudo chmod +x UnitySetUp');
            cp.execSync('echo y | ./UnitySetUp --unattended --install-location=/opt/Unity --verbose --download-location=/tmp/unity --components=Unity,Windows,Windows-Mono,Mac,Mac-Mono,WebGL');
            break;
    }
}

async function Run() {
    const version = core.getInput("unity-version", { required: true });
    const sha1 = GetSha1(version);
    const download_url = GetDownloadUrl(sha1);
    await ExecuteSetUp(download_url);
}

Run();