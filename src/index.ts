import { CreateInstaller } from './Installers/installer';
import { InstallOption } from './Installers/installer_definition';
import { getInput, setOutput } from '@actions/core';

async function Run() {
    const version = getInput("unity-version", { required: true });
    const unityInstaller = CreateInstaller();
    setOutput("id", unityInstaller.GetId(version));
    const option: InstallOption = {
        "has-android": getInput("has-android", { required: false }),
        "has-il2cpp": getInput("has-il2cpp", { required: false }),
        "has-ios": getInput("has-ios", { required: false }),
        "has-mac-mono": getInput("has-mac-mono", { required: false }),
        "has-webgl": getInput("has-webgl", { required: false }),
        "has-windows-mono": getInput("has-windows-mono", { required: false }),
    };
    await unityInstaller.ExecuteSetUp(version, option);
}

Run();