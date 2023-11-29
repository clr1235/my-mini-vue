import { camlize, toHandlerKey } from "../shared/index"

/**
 * 
 * @param instance 内置传递的组件实例对象
 * @param event 用户传递的emit事件名
 */
export const emit = (instance: any, event: any, ...args) => {
    // console.log('emit: ',  event)

    // 从props中找到emit事件名
    const {props} = instance
    // 如果有事件函数的话，执行
    const handlerName = toHandlerKey(camlize(event))
    const handler = props[handlerName]
    handler && handler(...args)
}