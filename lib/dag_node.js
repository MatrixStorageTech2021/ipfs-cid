/**
 * @fileOverview dag节点计算器
 * @name dag_node.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import assert from 'assert';
import Debug from 'debug';
import lodash from 'lodash';
import { PACKAGE_NAME, GENERATOR_TYPE } from './constants.js';
import { joinAsyncIterable } from './utils.js';
import { UnixFS } from 'ipfs-unixfs';
import ipld from 'ipld-dag-pb';
import multihashing from 'multihashing-async';
import CID from 'cids';

export const MODULE_KEY = `${PACKAGE_NAME}:DAGNodeGenerator`;
const debug = Debug(MODULE_KEY);
const { DAGNode, DAGLink } = ipld;
const { isInteger } = lodash;
const INSTANCE = Symbol('INSTANCE');
const MAX_LINKS = Symbol('MAX_LINKS');

export class DAGNodeGenerator {

  /**
   * 创建计算器实例
   * @static
   * @return {DAGNodeGenerator}
   */
  static createInstance() {
    if (!DAGNodeGenerator[INSTANCE]) {
      DAGNodeGenerator[INSTANCE] = new DAGNodeGenerator();
    }
    return DAGNodeGenerator[INSTANCE];
  }


  /**
   * 构造函数
   * @class
   * @param {Number} [maxLinks = 174] 最大link数量
   */
  constructor(maxLinks = 174) {

    debug('constructor %s', maxLinks);
    assert(isInteger(maxLinks), `[${MODULE_KEY}] constructor Error: wrong maxLinks`);
    this[MAX_LINKS] = maxLinks;

  }

  /**
   *匹配方法
   * @param {import("./compose").Target} target 计算目标
   * @return {boolean} true:匹配/false:不匹配
   */
  match(target) {

    debug('match %s', target);
    return target && target[Symbol.asyncIterator] && target[GENERATOR_TYPE] === DAGNode;

  }

  /**
   * @async
   * @param {AsyncIterable<DAGNode>} target 计算目标
   * @param {import("./compose").Opts} opts 计算可选项
   * @return {Promise<CID>} 生成的cid对象
   */
  async generate(target, opts = {}) {

    debug('generate %s , %s', target, opts);

    /** @type DAGNode[] **/
    const rootNodes = [];
    const parentNodes = generateParentDAGNodes(target, { ...opts, maxLinks: this[MAX_LINKS] });
    for (let i = 0; i < 2; i++) {
      const { value: parentNode, done } = await parentNodes.next();
      if (done) {
        break;
      }
      rootNodes.push(parentNode);
    }

    assert(rootNodes.length > 0, `[${MODULE_KEY}] generate Error: node must be more than one`);

    if (rootNodes.length === 1) {
      return await generateCID(rootNodes[0], opts);
    }
    const nextNodes = joinAsyncIterable(rootNodes, parentNodes);
    return await this.generate(nextNodes, opts);

  }
}

/**
 * 生成可选项
 * @typedef { import("./compose").Opts} Opts
 * @property {number} maxLinks 最大连接数量
 */

/**
   * @param {AsyncIterable<DAGNode>} nodes 计算目标
   * @param {Opts} opts 计算可选项
   * @return {AsyncIterable<DAGNode>} 生成的根dag节点
   */
async function* generateParentDAGNodes(nodes, opts, isFirst = true) {

  debug('generateParentDAGNodes %s , %s ,%s', nodes, opts, isFirst);

  let firstNode;
  const blockSizes = [];
  const links = [];
  for (let i = 0; i < opts.maxLinks; i++) {
    const { value: node, done } = await nodes.next();
    if (done) {
      break;
    }
    firstNode = firstNode || node;
    const nodeCID = await generateCID(node, opts);
    links.push(new DAGLink('', node.size, nodeCID.toString()));
    const unixFS = UnixFS.unmarshal(node.Data);
    blockSizes.push(unixFS.fileSize());
  }

  if (links.length <= 0) {
    return;
  }

  if (isFirst && links.length === 1) {
    yield firstNode;
    return;
  }

  const parent = new UnixFS({ type: 'file', blockSizes });
  const parentNode = new DAGNode(parent.marshal(), links);
  yield parentNode;

  const others = generateParentDAGNodes(nodes, opts, false);

  for await (const otherNode of others) {
    yield otherNode;
  }

}


/**
 *计算生成CID
 * @async
 * @param {DAGNode} node
 * @param {Opts} opts 计算可选项
 * @return {Promise<CID>} 生成的cid对象
 */
async function generateCID(node, opts) {

  debug('generateCID %s , %s', node, opts);

  const data = node.serialize();
  const hash = await multihashing(data, opts.algHashName);
  const cid = new CID(opts.version, opts.codec, hash, opts.multibaseName);
  return cid;
}
