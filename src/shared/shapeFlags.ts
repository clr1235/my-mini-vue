
export const enum ShapeFlags {
    ELEMENT = 1, // 二进制为：0001
    STATEFUL_COMPONENT = 1 << 1, // 十进制为2， 二进制为：0010
    TEXT_CHILDREN = 1 << 2, // 十进制为4，二进制为：0100
    ARRAY_CHILDREN = 1 << 3, // 十进制为8，二进制为：1000
    SLOT_CHILDREN = 1 << 4, // 十进制为16， 二进制为：010000
}