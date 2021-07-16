export const MODULE_KEY: string;
/**
 *创建异步可迭代对象
 * @async
 * @generator
 * yields {any}
 * @param {Array<any>} values 迭代值
 */
export function createAsyncIterable(...values: Array<any>): AsyncGenerator<any, void, unknown>;
/**
 *合并异步可迭代对象
 * @async
 * @generator
 * yields {any}
 * @param {...AsyncGenerator<any> | any[] | Iterable<any>} args 可迭代对象
 */
export function joinAsyncIterable(...args: (AsyncGenerator<any> | any[] | Iterable<any>)[]): AsyncGenerator<any, void, unknown>;
