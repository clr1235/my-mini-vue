export const extend = Object.assign

export const isObject = (val) => {
    return val !== null && typeof val === 'object'
}

export const hasChanged = (value: any, newVal: any) => {
    return !Object.is(value, newVal)
}

export const hasOwn = (val:any, key:any) => Object.prototype.hasOwnProperty.call(val, key)

// 首字母大写
export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
// - 转 驼峰
export const camlize = (str: string) => str.replace(/-(\w)/g, (_, c: string) => c ? c.toUpperCase() : '') 
export const toHandlerKey = (str) => str ? 'on' + capitalize(str) : ''