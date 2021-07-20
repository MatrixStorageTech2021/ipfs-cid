/**
 * @fileOverview 适配生成器
 * @name adapter.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';


const assert = require('assert');
const { isArray, isString, isNumber } = require('lodash');
const { PACKAGE_NAME, GENERATOR_TYPE } = require('./constants');
const { ComposeGenerator } = require('./compose');
const { joinAsyncIterable } = require('./utils');

const MODULE_KEY = `${PACKAGE_NAME}:AdapterGenerator`;
exports.MODULE_KEY = MODULE_KEY;
const debug = require('debug')(MODULE_KEY);

const COMPOSE_GENERATOR = Symbol('COMPOSE_GENERATOR');

class AdapterGenerator {
  /**
   * 构造函数
   * @class
   * @param {ComposeGenerator} generator 组合生成器
   */
  constructor(generator) {

    debug('constructor %s', generator);

    assert(generator instanceof ComposeGenerator, `[${MODULE_KEY}] constructor Error: wrong generator`);
    this[COMPOSE_GENERATOR] = generator;
  }

  /**
   *匹配方法
   * @param {import("./compose").Target} target 计算目标
   * @return {boolean} true:匹配/false:不匹配
   */
  match(target) {

    debug('match %s', target);

    if (!target || isString(target) || isNumber(target)) {
      return false;
    }

    if (isArray(target) || target[Symbol.iterator]) {
      return true;
    }

    return target[Symbol.asyncIterator] && !target[GENERATOR_TYPE];

  }

  /**
   * @async
   * @param {Array<any>| Iterable<any> | AsyncIterable<any>} target 计算目标
   * @param {import("./compose").Opts} opts 计算可选项
   * @return {Promise<CID>} 生成的cid对象
   */
  async generate(target, opts = {}) {

    debug('generate %s %s', target, opts);
    let value,
      done;
    if (isArray(target)) {
      value = target[0];
      done = target.length <= 0;
    } else if (target[Symbol.iterator]) {
      const next = target.next();
      value = next.value;
      done = next.done;
    } else {
      const next = await target.next();
      value = next.value;
      done = next.done;
    }

    let _target;
    if (done) {
      _target = joinAsyncIterable(target);
      _target[GENERATOR_TYPE] = Uint8Array;
    } else {
      const args = [ target ];
      if (!isArray(target)) {
        args.unshift([ value ]);
      }
      _target = joinAsyncIterable(...args);
      _target[GENERATOR_TYPE] = value.constructor;
    }

    const generator = this[COMPOSE_GENERATOR];
    return await generator.generate(_target, opts);
  }

}

exports.AdapterGenerator = AdapterGenerator;
