"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const installer_1 = require("./Installers/installer");
const core_1 = require("@actions/core");
function Run() {
    return __awaiter(this, void 0, void 0, function* () {
        const version = core_1.getInput("unity-version", { required: true });
        const unityInstaller = installer_1.CreateInstaller();
        core_1.setOutput("id", unityInstaller.GetId(version));
        const option = {
            "has-android": core_1.getInput("has-android", { required: false }),
            "has-il2cpp": core_1.getInput("has-il2cpp", { required: false }),
            "has-ios": core_1.getInput("has-ios", { required: false }),
            "has-mac-mono": core_1.getInput("has-mac-mono", { required: false }),
            "has-webgl": core_1.getInput("has-webgl", { required: false }),
            "has-windows-mono": core_1.getInput("has-windows-mono", { required: false }),
        };
        yield unityInstaller.ExecuteSetUp(version, option);
    });
}
Run();
