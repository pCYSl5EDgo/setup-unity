"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function GetCacheKeyVersionIndex(key, version, index) {
    return key + version + '-' + index;
}
exports.GetCacheKeyVersionIndex = GetCacheKeyVersionIndex;
function GetCacheKeyCount(key, version) {
    return key + version + "-count";
}
exports.GetCacheKeyCount = GetCacheKeyCount;
