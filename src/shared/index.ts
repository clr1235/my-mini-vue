export const extend = Object.assign

export const isObject = (val) => {
    return val !== null && typeof val === 'object'
}

export const hasChanged = (value: any, newVal: any) => {
    return !Object.is(value, newVal)
}

export const hasOwn = (val:any, key:any) => Object.prototype.hasOwnProperty.call(val, key)