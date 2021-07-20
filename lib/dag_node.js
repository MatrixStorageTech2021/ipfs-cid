/**
 * @fileOverview dag节点计算器
 * @name dag_node.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';


const assert = require('assert');
const { isInteger } = require('lodash');
const { PACKAGE_NAME, GENERATOR_TYPE } = require('./constants');
const { joinAsyncIterable } = require('./utils');
const { UnixFS } = require('ipfs-unixfs');
const { DAGNode, DAGLink } = require('ipld-dag-pb');
const multihashing = require('multihashing-async');
const CID = require('cids');

const MODULE_KEY = `${PACKAGE_NAME}:DAGNodeGenerator`;
exports.MODULE_KEY = MODULE_KEY;
const debug = require('debug')(MODULE_KEY);

const EMPTY_STRING = '';
const INSTANCE = Symbol('INSTANCE');
const MAX_LINKS = Symbol('MAX_LINKS');

class DAGNodeGenerator {

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
  let count = 0;
  let blockSizes = [];
  let links = [];
  for await (const node of nodes) {
    count++;
    firstNode = firstNode || node;
    const nodeCID = await generateCID(node, opts);
    links.push(new DAGLink(EMPTY_STRING, node.size, nodeCID.toString()));
    const unixFS = UnixFS.unmarshal(node.Data);
    blockSizes.push(unixFS.fileSize());

    if (count % opts.maxLinks === 0) {
      const parent = new UnixFS({ type: 'file', blockSizes });
      const parentNode = new DAGNode(parent.marshal(), links);
      yield parentNode;

      blockSizes = [];
      links = [];
    }
  }

  if (count > 1 && links.length > 0) {
    const parent = new UnixFS({ type: 'file', blockSizes });
    const parentNode = new DAGNode(parent.marshal(), links);
    yield parentNode;
  }

  if (count === 1) {
    yield firstNode;
  }

}

exports.DAGNodeGenerator = DAGNodeGenerator;

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
