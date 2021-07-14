/**
 * @fileOverview 工具代码
 * @name utils.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import { ComposeGenerator } from './compose';
import { DAGNodeGenerator } from './dag_node';
import { Uint8ArrayGenerator } from './uint8_array';

/**
 *创建异步可迭代对象
 * @async
 * @generator
 * yields {any}
 * @param {Array<any>} values 迭代值
 */
export async function* createAsyncIterable(...values) {
  for (const value of values) {
    yield value;
  }
}


/**
 *构建生成器
 * @param {import('./compose').Opts} opts 可选项
 * @returns {ComposeGenerator} cid生成器
 */
export function createGenerator(opts) {
  const generator = new ComposeGenerator(opts);
  generator.mount(DAGNodeGenerator.createInstance());
  generator.mount(Uint8ArrayGenerator.createInstance());
  return generator;
}
