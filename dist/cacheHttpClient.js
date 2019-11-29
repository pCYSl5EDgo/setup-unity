"use strict";
/*
The MIT License (MIT)

Copyright (c) 2018 GitHub, Inc. and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const Handlers_1 = require("typed-rest-client/Handlers");
const HttpClient_1 = require("typed-rest-client/HttpClient");
const RestClient_1 = require("typed-rest-client/RestClient");
function getCacheEntry(keys) {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheUrl = getCacheUrl();
        const token = process.env["ACTIONS_RUNTIME_TOKEN"] || "";
        const bearerCredentialHandler = new Handlers_1.BearerCredentialHandler(token);
        const resource = `_apis/artifactcache/cache?keys=${encodeURIComponent(keys.join(","))}`;
        const restClient = new RestClient_1.RestClient("actions/cache", cacheUrl, [
            bearerCredentialHandler
        ]);
        const response = yield restClient.get(resource, getRequestOptions());
        if (response.statusCode === 204) {
            return null;
        }
        if (response.statusCode !== 200) {
            throw new Error(`Cache service responded with ${response.statusCode}`);
        }
        const cacheResult = response.result;
        core.debug(`Cache Result:`);
        core.debug(JSON.stringify(cacheResult));
        if (!cacheResult || !cacheResult.archiveLocation) {
            throw new Error("Cache not found.");
        }
        return cacheResult;
    });
}
exports.getCacheEntry = getCacheEntry;
function downloadCache(cacheEntry, archivePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const stream = fs.createWriteStream(archivePath);
        const httpClient = new HttpClient_1.HttpClient("actions/cache");
        const downloadResponse = yield httpClient.get(cacheEntry.archiveLocation);
        yield pipeResponseToStream(downloadResponse, stream);
    });
}
exports.downloadCache = downloadCache;
function pipeResponseToStream(response, stream) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            response.message.pipe(stream).on("close", () => {
                resolve();
            });
        });
    });
}
function saveCache(stream, key) {
    return __awaiter(this, void 0, void 0, function* () {
        const cacheUrl = getCacheUrl();
        const token = process.env["ACTIONS_RUNTIME_TOKEN"] || "";
        const bearerCredentialHandler = new Handlers_1.BearerCredentialHandler(token);
        const resource = `_apis/artifactcache/cache/${encodeURIComponent(key)}`;
        const postUrl = cacheUrl + resource;
        const restClient = new RestClient_1.RestClient("actions/cache", undefined, [
            bearerCredentialHandler
        ]);
        const requestOptions = getRequestOptions();
        requestOptions.additionalHeaders = {
            "Content-Type": "application/octet-stream"
        };
        const response = yield restClient.uploadStream("POST", postUrl, stream, requestOptions);
        if (response.statusCode !== 200) {
            throw new Error(`Cache service responded with ${response.statusCode}`);
        }
        core.info("Cache saved successfully");
    });
}
exports.saveCache = saveCache;
function getRequestOptions() {
    const requestOptions = {
        acceptHeader: createAcceptHeader("application/json", "5.2-preview.1")
    };
    return requestOptions;
}
function createAcceptHeader(type, apiVersion) {
    return `${type};api-version=${apiVersion}`;
}
function getCacheUrl() {
    // Ideally we just use ACTIONS_CACHE_URL
    let cacheUrl = (process.env["ACTIONS_CACHE_URL"] ||
        process.env["ACTIONS_RUNTIME_URL"] ||
        "").replace("pipelines", "artifactcache");
    if (!cacheUrl) {
        throw new Error("Cache Service Url not found, unable to restore cache.");
    }
    core.debug(`Cache Url: ${cacheUrl}`);
    return cacheUrl;
}
