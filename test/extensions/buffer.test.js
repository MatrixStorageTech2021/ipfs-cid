/**
 * @fileOverview buffer cid生成器测试
 * @name buffer.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { MODULE_KEY, BufferGenerator } = require('../../extensions/buffer');
const { GENERATOR_TYPE } = require('../../lib/constants');
const { createGenerator, createAsyncIterable } = require('../../index');
const CID = require('cids');
const faker = require('faker');
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

class ModelClass {

}

describe('extensions/buffer', () => {

  it('MODULE_KEY', () => {
    expect(MODULE_KEY).toBe('ipfs-cid:BufferGenerator');
  });

  describe('BufferGenerator', () => {

    /** @type BufferGenerator **/
    let bufferGenerator;

    beforeEach(() => {
      bufferGenerator = new BufferGenerator();
      const generator = createGenerator(DEFAULT_OPTS);
      generator.mount(bufferGenerator);
    });

    describe('match', () => {

      it('simple', () => {

        expect(bufferGenerator.match({})).toBeFalsy();
        expect(bufferGenerator.match({})).toBeFalsy();
        expect(bufferGenerator.match()).toBeFalsy();
        expect(bufferGenerator.match(faker.datatype.array())).toBeFalsy();
        expect(bufferGenerator.match(faker.datatype.boolean())).toBeFalsy();
        expect(bufferGenerator.match(faker.datatype.string())).toBeFalsy();
        expect(bufferGenerator.match(faker.datatype.number())).toBeFalsy();
        expect(bufferGenerator.match(faker.datatype.datetime())).toBeFalsy();
        expect(bufferGenerator.match(null)).toBeFalsy();
        expect(bufferGenerator.match(ModelClass)).toBeFalsy();
        expect(bufferGenerator.match(new ModelClass())).toBeFalsy();
        expect(bufferGenerator.match(() => { })).toBeFalsy();
        expect(bufferGenerator.match(new Uint8Array())).toBeFalsy();

        const matchObj = createAsyncIterable(Buffer.from(faker.datatype.array()));
        expect(bufferGenerator.match(matchObj)).toBeFalsy();

        matchObj[GENERATOR_TYPE] = Buffer;
        expect(bufferGenerator.match(matchObj)).toBeTruthy();

      });

    });

    describe('generate', () => {

      it('simple', async () => {

        const helloContent = fs.createReadStream(HELLO_PATH);
        const helloCid = await bufferGenerator.generate(helloContent, DEFAULT_OPTS);

        expect(helloCid).toBeInstanceOf(CID);
        expect(helloCid.toString()).toBe('QmXxT7EkBJ3oRerJLWMeQ1pSne9EdVSZn1p1Bvn7KgwNTK');

        const emptyContent = fs.createReadStream(EMPTY_PATH);
        const emptyCid = await bufferGenerator.generate(emptyContent, DEFAULT_OPTS);

        expect(emptyCid).toBeInstanceOf(CID);
        expect(emptyCid.toString()).toBe('QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH');

        const simpleContent = fs.createReadStream(SIMPLE_PATH, { highWaterMark: DEFAULT_OPTS.chunk });
        const simpleCid = await bufferGenerator.generate(simpleContent, DEFAULT_OPTS);

        expect(simpleCid).toBeInstanceOf(CID);
        expect(simpleCid.toString()).toBe('QmaL1KiQRV8secNszpjjFPg722T53c77k2dz5UsNua59ZT');

        const simpleSlowContent = fs.createReadStream(SIMPLE_PATH, { highWaterMark: DEFAULT_OPTS.chunk + 10 });
        const simpleSlowCid = await bufferGenerator.generate(simpleSlowContent, DEFAULT_OPTS);

        expect(simpleSlowCid).toBeInstanceOf(CID);
        expect(simpleSlowCid.toString()).toBe('QmaL1KiQRV8secNszpjjFPg722T53c77k2dz5UsNua59ZT');

      });

    });

  });
});
