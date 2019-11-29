"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function GetCacheKeyVersionIndex(version, index) {
    return 'LLV' + version + '-' + index;
}
exports.GetCacheKeyVersionIndex = GetCacheKeyVersionIndex;
function GetCacheKeyCount(version) {
    return 'LV' + version + "-count";
}
exports.GetCacheKeyCount = GetCacheKeyCount;
