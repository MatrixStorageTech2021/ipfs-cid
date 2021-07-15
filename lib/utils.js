/**
 * @fileOverview 工具代码
 * @name utils.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import Debug from 'debug';
import { PACKAGE_NAME } from './constants.js';
import lodash from 'lodash';

export const MODULE_KEY = `${PACKAGE_NAME}:Utils`;
const debug = Debug(MODULE_KEY);
const { isArray } = lodash;

/**
 *创建异步可迭代对象
 * @async
 * @generator
 * yields {any}
 * @param {Array<any>} values 迭代值
 */
export async function* createAsyncIterable(...values) {
  debug('createAsyncIterable %s', values);
  for (const value of values) {
    yield value;
  }
}

/**
 *合并异步可迭代对象
 * @async
 * @generator
 * yields {any}
 * @param {...AsyncGenerator<any> | any[] | Iterable<any>} args 可迭代对象
 */
export async function* joinAsyncIterable(...args) {

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
