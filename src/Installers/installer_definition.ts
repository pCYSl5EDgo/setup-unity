export interface Installer {
    GetId(version: string): string;
    ExecuteSetUp(version: string): Promise<void>;
}