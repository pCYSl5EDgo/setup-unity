export function GetCacheKeyVersionIndex(version: string, index: number):string {
    return 'Linux-v' + version + '-' + index;
}

export function GetCacheKeyCount(version: string):string {
    return 'Linux-v' + version + "-count";
}