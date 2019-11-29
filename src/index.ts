import * as core from '@actions/core';
import { CreateInstaller } from './Installers/installer';

async function Run() {
    const version = core.getInput("unity-version", { required: true });
    const unityInstaller = CreateInstaller();
    core.setOutput("id", unityInstaller.GetId(version));
    await unityInstaller.ExecuteSetUp(version);
}

Run();