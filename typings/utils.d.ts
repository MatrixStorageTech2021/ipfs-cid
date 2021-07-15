/**
 *创建异步可迭代对象
 * @async
 * @generator
 * yields {any}
 * @param {Array<any>} values 迭代值
 */
export function createAsyncIterable(...values: Array<any>): AsyncGenerator<any, void, unknown>;
/**
 *构建生成器
 * @param {import('./compose').Opts} opts 可选项
 * @return {ComposeGenerator} cid生成器
 */
export function createGenerator(opts: import('./compose').Opts): ComposeGenerator;
import { ComposeGenerator } from "./compose";
