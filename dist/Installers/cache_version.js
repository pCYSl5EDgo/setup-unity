"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function GetCacheKeyVersionIndex(version, index) {
    return 'Linux-v' + version + '-' + index;
}
exports.GetCacheKeyVersionIndex = GetCacheKeyVersionIndex;
function GetCacheKeyCount(version) {
    return 'Linux-v' + version + "-count";
}
exports.GetCacheKeyCount = GetCacheKeyCount;
