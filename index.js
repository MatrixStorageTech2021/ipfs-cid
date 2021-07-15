/**
 * @fileOverview 目录文件
 * @name index.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import { ComposeGenerator, DAGNodeGenerator, Uint8ArrayGenerator, AdapterGenerator } from './lib/index.js';
export * from './lib/index.js';

/**
 *构建生成器
 * @param {import('./compose').Opts} opts 可选项
 * @return {ComposeGenerator} cid生成器
 */
export function createGenerator(opts) {
  const generator = new ComposeGenerator(opts);
  const adapter = new AdapterGenerator(generator);
  generator.mount(adapter);
  generator.mount(DAGNodeGenerator.createInstance());
  generator.mount(Uint8ArrayGenerator.createInstance());
  return generator;
}
