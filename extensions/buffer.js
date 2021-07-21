/**
 * @fileOverview buffer cid生成器
 * @name buffer.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { PACKAGE_NAME, GENERATOR_TYPE } = require('../lib/constants');
const { Uint8ArrayGenerator } = require('../lib/uint8_array');

const MODULE_KEY = `${PACKAGE_NAME}:BufferGenerator`;
exports.MODULE_KEY = MODULE_KEY;
const debug = require('debug')(MODULE_KEY);
const INSTANCE = Symbol('INSTANCE');
const UINT8ARRAY_GENERATOR = Symbol('UINT8ARRAY_GENERATOR');

class BufferGenerator {

  /**
   * 创建计算器实例
   * @static
   * @return {BufferGenerator}
   */
  static createInstance() {
    if (!BufferGenerator[INSTANCE]) {
      BufferGenerator[INSTANCE] = new BufferGenerator();
    }
    return BufferGenerator[INSTANCE];
  }

  /**
   *初始化
   * @param {any} generator Uint8ArrayGenerator实例
   * @return {boolean} true:成功/false:失败
   */
  init(generator) {
    debug('init %s', generator);
    const res = generator && generator instanceof Uint8ArrayGenerator;
    if (res) {
      this[UINT8ARRAY_GENERATOR] = generator;
    }
    return res;
  }

  /**
   *匹配方法
   * @param {import("../lib/compose").Target} target 计算目标
   * @return {boolean} true:匹配/false:不匹配
   */
  match(target) {

    debug('match %s', target);
    return target && target[Symbol.asyncIterator ] && target[GENERATOR_TYPE] === Buffer;

  }

  /**
   *
   * @param {AsyncIterable<Buffer>} target 计算目标
   * @param {import("../lib/compose").Opts} opts 计算可选项
   * @return {import("cids")}
   */
  async generate(target, opts) {

    debug('generate %s , %s', target, opts);

    /** @type Uint8ArrayGenerator **/
    const nextGenerator = this[UINT8ARRAY_GENERATOR];
    const nextTarget = transform(target);
    return await nextGenerator.generate(nextTarget, opts);
  }
}

exports.BufferGenerator = BufferGenerator;

/**
 *转换函数
 * @async
 * @generator
 * yields {Uint8Array}
 * @param {AsyncIterable<Buffer>} target 计算目标
 */
async function* transform(target) {
  for await (const chunk of target) {
    yield new Uint8Array(chunk);
  }
}
