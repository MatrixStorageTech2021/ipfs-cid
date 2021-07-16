import { ComposeGenerator } from "./lib/compose";
import { DAGNodeGenerator } from ".//lib/dag_node";
import { Uint8ArrayGenerator } from "./lib/uint8_array";
import { AdapterGenerator } from ".//lib/adapter";
import { createAsyncIterable } from "./lib/utils";
import { joinAsyncIterable } from "./lib/utils";
/**
 *构建生成器
 * @param {import('./lib/compose').Opts} opts 可选项
 * @return {ComposeGenerator} cid生成器
 */
export function createGenerator(opts: import('./lib/compose').Opts): ComposeGenerator;
export { ComposeGenerator, DAGNodeGenerator, Uint8ArrayGenerator, AdapterGenerator, createAsyncIterable, joinAsyncIterable };
