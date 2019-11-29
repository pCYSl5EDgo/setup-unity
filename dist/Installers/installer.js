"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LinuxInstaller_1 = require("./LinuxInstaller");
const WindowsInstaller_1 = require("./WindowsInstaller");
const MacOSInstaller_1 = require("./MacOSInstaller");
function CreateInstaller() {
    switch (process.platform) {
        case "darwin":
            return new MacOSInstaller_1.MacOSInstaller();
        case "win32":
            return new WindowsInstaller_1.WindowsInstaller();
        default:
            return new LinuxInstaller_1.LinuxInstaller();
    }
}
exports.CreateInstaller = CreateInstaller;
