import { Installer } from './installer_definition';
import { GetId } from '../utility';
import { exec } from '@actions/exec';

export class MacOSInstaller implements Installer {
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
        const download_url = "https://beta.unity3d.com/download/" + GetId(version) + "/MacEditorInstaller/Unity.pkg";
        await exec('curl -OL ' + download_url)
        await exec("sudo installer -package Unity.pkg -target /");
    }
}