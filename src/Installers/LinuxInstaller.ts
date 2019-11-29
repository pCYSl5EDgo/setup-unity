import { Installer } from './installer_definition';
import { GetId } from '../utility';
import * as exec from '@actions/exec';
import * as cp from 'child_process';

export class LinuxInstaller implements Installer {
    version: string | undefined;
    id: string | undefined;
    GetId(version: string): string {
        if (this.version === version) {
            if (this.id)
                return this.id;
            return this.id = GetId(version);
        }
        this.version = version;
        return this.id = GetId(version);
    }
    async ExecuteSetUp(version: string): Promise<void> {
        const download_url: string = "https://beta.unity3d.com/download/" + GetId(version) + "/UnitySetup";
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
        await exec.exec('wget ' + download_url + ' -O UnitySetUp');
        await exec.exec('sudo chmod +x UnitySetUp');
        cp.execSync('echo y | ./UnitySetUp --unattended --install-location="/opt/Unity-' + version + '"');
        cp.execSync('mv /opt/Unity-' + version + '/ /opt/Unity/');
        await exec.exec('sudo rm -f UnitySetUp');
    }
}