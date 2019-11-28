import * as core from '@actions/core';
import { GetSha1, ExecuteSetUp, GetDownloadUrl } from './installer.js';

async function Run() {
    const version = core.getInput("unity-version", { required: true });
    const id = GetSha1(version);
    core.setOutput("id", id);
    await ExecuteSetUp(GetDownloadUrl(id), version);
}

Run();