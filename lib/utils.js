/**
 * @fileOverview 工具代码
 * @name utils.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';


const { PACKAGE_NAME } = require('./constants');
const { isArray } = require('lodash');

const MODULE_KEY = `${PACKAGE_NAME}:Utils`;
exports.MODULE_KEY = MODULE_KEY;
const debug = require('debug')(MODULE_KEY);

/**
 *创建异步可迭代对象
 * @async
 * @generator
 * yields {any}
 * @param {Array<any>} values 迭代值
 */
async function* createAsyncIterable(...values) {
  debug('createAsyncIterable %s', values);
  for (const value of values) {
    yield value;
  }
}
exports.createAsyncIterable = createAsyncIterable;

/**
 *合并异步可迭代对象
 * @async
 * @generator
 * yields {any}
 * @param {...AsyncGenerator<any> | any[] | Iterable<any>} args 可迭代对象
 */
async function* joinAsyncIterable(...args) {

  debug('joinAsyncIterable %s', args);

  for (const items of args) {

    if (isArray(items) || items[Symbol.iterator]) {
      for (const value of items) {
        yield value;
      }
      continue;
    }

    if (items[Symbol.asyncIterator]) {
      for await (const value of items) {
        yield value;
      }
      continue;
    }

  }
}

exports.joinAsyncIterable = joinAsyncIterable;
