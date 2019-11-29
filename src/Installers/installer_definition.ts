export interface Installer {
    GetId(version: string): string;
    ExecuteSetUp(version: string, option: InstallOption): Promise<void>;
}

export interface InstallOption {
    "has-webgl": string | undefined;
    "has-android": string | undefined;
    "has-ios": string | undefined;
    "has-il2cpp": string | undefined;
    "has-windows-mono": string | undefined;
    "has-mac-mono": string | undefined;
}