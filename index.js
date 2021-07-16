/**
 * @fileOverview 目录文件
 * @name index.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';


const { ComposeGenerator } = require('./lib/compose');
exports.ComposeGenerator = ComposeGenerator;

const { DAGNodeGenerator } = require('.//lib/dag_node');
exports.DAGNodeGenerator = DAGNodeGenerator;

const { Uint8ArrayGenerator } = require('./lib/uint8_array');
exports.Uint8ArrayGenerator = Uint8ArrayGenerator;

const { AdapterGenerator } = require('.//lib/adapter');
exports.AdapterGenerator = AdapterGenerator;

const { createAsyncIterable, joinAsyncIterable } = require('./lib/utils');
exports.createAsyncIterable = createAsyncIterable;
exports.joinAsyncIterable = joinAsyncIterable;


/**
 *构建生成器
 * @param {import('./lib/compose').Opts} opts 可选项
 * @return {ComposeGenerator} cid生成器
 */
function createGenerator(opts) {
  const generator = new ComposeGenerator(opts);
  const adapter = new AdapterGenerator(generator);
  generator.mount(adapter);
  generator.mount(DAGNodeGenerator.createInstance());
  generator.mount(Uint8ArrayGenerator.createInstance());
  return generator;
}

module.exports = {
  createGenerator,
  ComposeGenerator, DAGNodeGenerator, Uint8ArrayGenerator, AdapterGenerator, joinAsyncIterable, createAsyncIterable,
};
