/**
 * @fileOverview 包入口文件测试
 * @name index.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';


const { createGenerator, ComposeGenerator, DAGNodeGenerator, Uint8ArrayGenerator, AdapterGenerator } = require('../index');
const CID = require('cids');
const fs = require('fs');
const path = require('path');

const HELLO_PATH = path.join(process.cwd(), 'test', 'fixtures', 'simple', 'HelloWorld.txt');
const EMPTY_PATH = path.join(process.cwd(), 'test', 'fixtures', 'simple', 'empty.file');
const SIMPLE_PATH = path.join(process.cwd(), 'test', 'fixtures', 'simple', '43.75MB.file');

const DEFAULT_OPTS = {
  chunk: 262144,
  algHashName: 'sha2-256',
  version: 0,
  codec: 'dag-pb',
  multibaseName: 'base58btc',
};

describe('index.test.js', () => {

  it('export match', () => {
    expect(ComposeGenerator).toBeInstanceOf(Function);
    expect(DAGNodeGenerator).toBeInstanceOf(Function);
    expect(Uint8ArrayGenerator).toBeInstanceOf(Function);
    expect(AdapterGenerator).toBeInstanceOf(Function);
    expect(createGenerator).toBeInstanceOf(Function);
  });

  describe('createGenerator', () => {

    it('simple', async () => {

      const generator = createGenerator();
      expect(generator).toBeInstanceOf(ComposeGenerator);

      const helloContent = fs.createReadStream(HELLO_PATH);
      const helloCid = await generator.generate(trasformUint8Array(helloContent));

      expect(helloCid).toBeInstanceOf(CID);
      expect(helloCid.toString()).toBe('QmXxT7EkBJ3oRerJLWMeQ1pSne9EdVSZn1p1Bvn7KgwNTK');

      const emptyContent = fs.createReadStream(EMPTY_PATH);
      const emptyCid = await generator.generate(trasformUint8Array(emptyContent));

      expect(emptyCid).toBeInstanceOf(CID);
      expect(emptyCid.toString()).toBe('QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH');

      const simpleContent = fs.createReadStream(SIMPLE_PATH, { highWaterMark: DEFAULT_OPTS.chunk });
      const simpleCid = await generator.generate(trasformUint8Array(simpleContent));

      expect(simpleCid).toBeInstanceOf(CID);
      expect(simpleCid.toString()).toBe('QmaL1KiQRV8secNszpjjFPg722T53c77k2dz5UsNua59ZT');

      const simpleSlowContent = fs.createReadStream(SIMPLE_PATH);
      const simpleSlowCid = await generator.generate(trasformUint8Array(simpleSlowContent));

      expect(simpleSlowCid).toBeInstanceOf(CID);
      expect(simpleSlowCid.toString()).toBe('QmaL1KiQRV8secNszpjjFPg722T53c77k2dz5UsNua59ZT');

    });

  });

});

async function* trasformUint8Array(stream) {
  for await (const chunk of stream) {
    yield new Uint8Array(chunk);
  }
}
