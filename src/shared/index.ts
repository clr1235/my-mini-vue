export const extend = Object.assign

export const isObject = (val) => {
    return val !== null && typeof val === 'object'
}

export const hasChanged = (value: any, newVal: any) => {
    return !Object.is(value, newVal)
}