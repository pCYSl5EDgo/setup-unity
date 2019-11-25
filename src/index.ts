let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';

import * as core from '@actions/core';
import * as path from 'path';
import * as jsdom from "jsdom";
import { default as request } from 'sync-request';
import * as fs from 'fs';
import { execSync } from 'child_process';

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

function GetSha1Final(major: number, minor: number, patch: number): string {
    const path = "https://unity3d.com/unity/whats-new/" + major.toString() + "." + minor.toString() + "." + patch.toString();
    core.warning("path\n" + path);
    const html = request("GET", path).body;
    //core.warning("html\n" + html.toString());
    const dom = new jsdom.JSDOM(html);
    core.warning("faq count\n" + dom.window.document.getElementsByClassName("faq").length);
    const div0 = dom.window.document.getElementsByClassName("faq").item(0) as HTMLDivElement;
    //core.warning("div0\n" + div0.innerHTML);
    const p0 = div0.getElementsByClassName("info").item(0) as HTMLParagraphElement;
    core.warning("p0\n" + p0.innerHTML);
    const a0 = p0.children.item(0) as HTMLAnchorElement;
    core.warning("a0\n" + a0.innerHTML);
    const href:String = a0.href;
    return href.substr(44, 12);
}

function GetSha1Alpha(version: string): string {
    const html = request("GET", "https://unity3d.com/unity/alpha/" + version).body;
    const dom = new jsdom.JSDOM(html);
    const div0 = dom.window.document.getElementsByClassName("faq").item(0) as HTMLDivElement;
    const p0 = div0.getElementsByClassName("info").item(0) as HTMLParagraphElement;
    const a0 = p0.children.item(0) as HTMLAnchorElement;
    const href:String = a0.href;
    return href.substr(34, 12);
}

function GetSha1Beta(version: string): string {
    const html = request("GET", "https://unity3d.com/unity/beta/" + version).body;
    const dom = new jsdom.JSDOM(html);
    const div0 = dom.window.document.getElementsByClassName("faq").item(0) as HTMLDivElement;
    const p0 = div0.getElementsByClassName("info").item(0) as HTMLParagraphElement;
    const a0 = p0.children.item(0) as HTMLAnchorElement;
    const href:String = a0.href;
    return href.substr(34, 12);
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
            return "SetUp.pkg";
        case "win32":
            return "SetUp.exe";
        default:
            return "SetUp";
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

function ExecuteSetUp() {
    switch (process.platform) {
        case "win32":
            execSync('UnitySetup64.exe /S /D="C:\Program Files\Unity"');
            break;
        case "darwin":
            execSync("sudo installer -package Unity.pkg -target /");
            break;
        default:
            execSync('sudo chmod +x UnitySetup && echo y | ./UnitySetUp --unattended --install-location=/opt/Unity --verbose --download-location=/tmp/unity --components=Unity && sudo rm UnitySetUp && sudo rm -rf /tmp/unity && sudo rm -rf /root/.local/share/Trash/*');
            break;
    }
}

function Run() {
    const version = core.getInput("unity-version", { required: true });
    const sha1 = GetSha1(version);
    const download_url = GetDownloadUrl(sha1);
    fs.writeFileSync(GetSetUpName(), request("GET", download_url))
    ExecuteSetUp();
}

Run();