export function GetCacheKeyVersionIndex(key: string | undefined, version: string, index: number):string {
    return key + version + '-' + index;
}

export function GetCacheKeyCount(key: string | undefined, version: string):string {
    return key + version + "-count";
}