import { Installer } from './installer_definition';
import { GetId } from '../utility';
import { execSync } from 'child_process';

export class WindowsInstaller implements Installer {
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
        const download_url = "https://beta.unity3d.com/download/" + GetId(version) + "/Windows64EditorInstaller/UnitySetup64.exe"

        //await exec.exec('Invoke-WebRequest -Uri ' + download_url + ' -OutFile ./UnitySetup64.exe');
        // なんてことだ！
        // 信じられない！
        // 上記のInvoke-WebRequestにすると2018.3.7f1をダウンロードしてくるのだ。
        // Unity2020を要求しているのにも関わらず！
        // しょうがないからbitsadminする他無い！            
        execSync('bitsadmin /TRANSFER bj /download /priority foreground ' + download_url + ' %CD%\\UnitySetup64.exe');
        execSync('UnitySetup64.exe /UI=reduced /S /D=C:\\Program Files\\Unity');
    }
}