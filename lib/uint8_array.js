/**
 * @fileOverview uint8数组cid生成器
 * @name uint8_array.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import lodash from 'lodash';
import Debug from 'debug';
import { PACKAGE_NAME, GENERATOR_TYPE } from './constants.js';
import { UnixFS } from 'ipfs-unixfs';
import ipld from 'ipld-dag-pb';
import { DAGNodeGenerator } from './dag_node.js';

export const MODULE_KEY = `${PACKAGE_NAME}:Uint8ArrayGenerator`;
const debug = Debug(MODULE_KEY);
const { DAGNode } = ipld;
const { chunk } = lodash;
const INSTANCE = Symbol('INSTANCE');
const DAGNODE_GENERATOR = Symbol('DAGNODE_GENERATOR');

export class Uint8ArrayGenerator {

  /**
   * 创建计算器实例
   * @static
   * @return {Uint8ArrayGenerator}
   */
  static createInstance() {
    if (!Uint8ArrayGenerator[INSTANCE]) {
      Uint8ArrayGenerator[INSTANCE] = new Uint8ArrayGenerator();
    }
    return Uint8ArrayGenerator[INSTANCE];
  }

  /**
   *初始化
   * @param {any} generator DAGNodeGenerator实例
   * @return {boolean} true:成功/false:失败
   */
  init(generator) {
    const res = generator && generator instanceof DAGNodeGenerator;
    if (res) {
      this[DAGNODE_GENERATOR] = generator;
    }
    return res;
  }

  /**
   *匹配方法
   * @param {import("./compose").Target} target 计算目标
   * @return {boolean} true:匹配/false:不匹配
   */
  match(target) {

    debug('match %s', target);
    return target && target[Symbol.asyncIterator ] && target[GENERATOR_TYPE] === Uint8Array;

  }

  /**
   *
   * @param {AsyncIterable<Uint8Array>} target 计算目标
   * @param {import("./compose").Opts} opts 计算可选项
   * @return {import("cids")}
   */
  async generate(target, opts) {

    debug('generate %s , %s', target, opts);

    /** @type DAGNodeGenerator **/
    const nextGenerator = this[DAGNODE_GENERATOR];
    const dagNodes = generateDAGNodes(target, opts);

    return await nextGenerator.generate(dagNodes, opts);
  }

}

/**
 *计算生成dagNode异步可迭代对象
 * @async
 * @generator
 * yields {DAGNode}
 * @param {AsyncIterable<Uint8Array>} uint8Arrays uint8array可迭代对象
 * @param {import('./compose').Opts} opts
 */
async function* generateDAGNodes(uint8Arrays, opts) {

  debug('generateDAGNodes %s , %s', uint8Arrays, opts);

  let remainArray;
  let totalLength = 0;
  for await (const uint8Array of uint8Arrays) {

    let current;
    totalLength += uint8Array.length;
    if (totalLength < opts.chunk) {
      remainArray = remainArray ? [ ...remainArray, uint8Array ] : [ uint8Array ];
      continue;
    }
    if (remainArray) {
      current = joinUint8ArrayList([ ...remainArray, uint8Array ], totalLength);
    } else {
      current = uint8Array;
    }

    const chunkArray = current.length === opts.chunk ? [ current ] : chunk(current, opts.chunk);
    totalLength = totalLength % opts.chunk;
    if (totalLength === 0) {
      remainArray = null;
    } else {
      remainArray = [ chunkArray.pop() ];
    }

    for (const chunkData of chunkArray) {
      yield generateDAGNode(chunkData);
    }
  }

  if (remainArray !== null) {
    yield generateDAGNode(remainArray ? joinUint8ArrayList(remainArray, totalLength) : new Uint8Array());
  }
}


/**
 * @param {Uint8Array} chunkData 块内容
 *@returns {DAGNode} 生成的文件节点
 */
function generateDAGNode(chunkData) {
  debug('generateDAGNode %s , %s', chunkData);

  const unixFS = new UnixFS({ type: 'file', data: chunkData });
  return new DAGNode(unixFS.marshal());
}

function joinUint8ArrayList(list, length) {

  const res = new Uint8Array(length);
  let offset = 0;
  for (const item of list) {
    res.set(item, offset);
    offset += item.length;
  }
  return res;
}
