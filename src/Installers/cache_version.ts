export function GetCacheKeyVersionIndex(version: string, index: number):string {
    return 'LLV' + version + '-' + index;
}

export function GetCacheKeyCount(version: string):string {
    return 'LV' + version + "-count";
}