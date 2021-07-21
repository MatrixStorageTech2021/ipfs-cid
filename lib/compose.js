/**
 * @fileOverview 组合生成器代码
 * @name compose.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';


const assert = require('assert');
const { isFunction } = require('lodash');
const { PACKAGE_NAME } = require('./constants');
const CID = require('cids');

const MODULE_KEY = `${PACKAGE_NAME}:ComposeGenerator`;
exports.MODULE_KEY = MODULE_KEY;
const debug = require('debug')(MODULE_KEY);

const GENERATORS = Symbol('GENERATORS');
const OPTIONS = Symbol('OPTIONS');
const INSTANCE = Symbol('INSTANCE');
const DEFAULT_OPTS = {
  chunk: 262144,
  algHashName: 'sha2-256',
  version: 0,
  codec: 'dag-pb',
  multibaseName: 'base58btc',
};

/**
 * CID类型
 * @typedef { import("cids") } CID
 */

/**
 * 计算目标
 * @typedef { Uint8Array | Blob | String |  Iterable<Uint8Array> | Iterable<number> | AsyncIterable<Uint8Array> | ReadableStream<Uint8Array> } Target
 */

/**
 * 计算可选项
 * @typedef { Object } Opts
 * @property {Number} [chunk = 262144] 拆分文件大小
 * @property {String} [algHashName = "sha2-256"] 计算的hash算法名称
 * @property {Number} [version = 0] cid版本号
 * @property {String} [codec = "dag-pb"] cid编码
 * @property {String} [multibaseName = "base58btc"] multibase名称
 */

/**
 * 生成器
 * @interface CIDGenerator
 */
/**
 * 初始化
 * @function
 * @name CIDGenerator#init
* @param {CIDGenerator} generator 计算目标
* @returns {boolean} true:已经初始化/false:未初始化
 */
/**
 * 匹配方法
 * @function
 * @name CIDGenerator#match
* @param {Target} target 计算目标
* @returns {boolean} true:匹配/false:不匹配
 */
/**
 * 生成方法
 *
 * @async
 * @function
 * @name CIDGenerator#generate
* @param {Target} target 计算目标
* @param {Opts} opts 计算可选参数
* @returns {Promise<import("cids")>} 计算出的cid对象
*/

/**

*/
class ComposeGenerator {

  /**
   * 创建计算器实例
   * @static
   * @return {ComposeGenerator}
   */
  static createInstance() {
    if (!ComposeGenerator[INSTANCE]) {
      ComposeGenerator[INSTANCE] = new ComposeGenerator();
    }
    return ComposeGenerator[INSTANCE];
  }

  /**
   * @private
   * @readonly
   * @type {CIDGenerator[]}
   */
  [GENERATORS] = []

  /**
   * 引擎构造函数
   * @class
   * @param {Opts} [opts] 计算可选项
   */
  constructor(opts = {}) {

    debug('constructor %s', opts);
    this[OPTIONS] = opts;

  }

  /**
   *装载cid生成器
   * @param {CIDGenerator} generator 生成器
   */
  mount(generator) {

    debug('mount %s', generator);
    this[GENERATORS].push(generator);
    if (!isFunction(generator.init)) {
      return;
    }

    let success = false;
    const generators = this[GENERATORS];
    for (let i = generators.length - 2; i >= 0; i--) {
      success = generator.init(generators[i]);
      if (success) {
        break;
      }
    }

    assert(success, `[${MODULE_KEY}] mount Error: init fatal`);
  }

  /**
   *卸载cid生成器
   * @param {CIDGenerator} generator 生成器
   */
  umount(generator) {

    debug('umount %s', generator);

    const generators = this[GENERATORS];
    const index = generators.findIndex(_ => _ === generator);
    if (index > -1) {
      generators.splice(index, 1);
    }

  }

  /**
   *计算cid方法
   *
   * @asnyc
   * @param {Target} target 计算目标
   * @param {Opts} opts 计算可选项
   * @return {Promise<CID>} 生成的cid
   */
  async generate(target, opts = {}) {

    debug('generate %s', target);

    const defaultOpts = this[OPTIONS];
    const _opts = { ...DEFAULT_OPTS, ...defaultOpts, ...opts };
    let cid;
    for (const generator of this[GENERATORS]) {
      if (generator.match(target)) {
        cid = await generator.generate(target, _opts);
        break;
      }
    }

    assert(cid instanceof CID, `[${MODULE_KEY}] generate Error: Not Support`);
    return cid;
  }
}

exports.ComposeGenerator = ComposeGenerator;
