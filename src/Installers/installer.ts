import { Installer } from './installer_definition';
import { LinuxInstaller } from './LinuxInstaller';
import { WindowsInstaller } from './WindowsInstaller';
import { MacOSInstaller } from './MacOSInstaller';

export function CreateInstaller(): Installer {
    switch (process.platform) {
        case "darwin":
            return new MacOSInstaller();
        case "win32":
            return new WindowsInstaller();
        default:
            return new LinuxInstaller();
    }
}