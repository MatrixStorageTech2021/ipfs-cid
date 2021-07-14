/**
 * @fileOverview uint8数组生成器测试
 * @name uint8_array.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import { MODULE_KEY, Uint8ArrayGenerator } from '../../lib/uint8_array.js';
import { GENERATOR_TYPE } from '../../lib/constants.js';
import { DAGNodeGenerator } from '../../lib/dag_node.js';
import { createAsyncIterable } from '../../lib/utils.js';
import CID from 'cids';
import faker from 'faker';
import * as fs from 'fs';
import * as path from 'path';

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

describe('lib/uint8_array', () => {

  it('MODULE_KEY', () => {
    expect(MODULE_KEY).toBe('ipfs-cid:Uint8ArrayGenerator');
  });

  describe('Uint8ArrayGenerator', () => {

    /** @type Uint8ArrayGenerator **/
    let uint8ArrayGenerator;

    beforeEach(() => {
      uint8ArrayGenerator = new Uint8ArrayGenerator();
      uint8ArrayGenerator.init(new DAGNodeGenerator());
    });

    describe('match', () => {

      it('simple', () => {

        expect(uint8ArrayGenerator.match({})).toBeFalsy();
        expect(uint8ArrayGenerator.match({})).toBeFalsy();
        expect(uint8ArrayGenerator.match()).toBeFalsy();
        expect(uint8ArrayGenerator.match(faker.datatype.array())).toBeFalsy();
        expect(uint8ArrayGenerator.match(faker.datatype.boolean())).toBeFalsy();
        expect(uint8ArrayGenerator.match(faker.datatype.string())).toBeFalsy();
        expect(uint8ArrayGenerator.match(faker.datatype.number())).toBeFalsy();
        expect(uint8ArrayGenerator.match(faker.datatype.datetime())).toBeFalsy();
        expect(uint8ArrayGenerator.match(null)).toBeFalsy();
        expect(uint8ArrayGenerator.match(ModelClass)).toBeFalsy();
        expect(uint8ArrayGenerator.match(new ModelClass())).toBeFalsy();
        expect(uint8ArrayGenerator.match(() => { })).toBeFalsy();
        expect(uint8ArrayGenerator.match(new Uint8Array())).toBeFalsy();

        const matchObj = createAsyncIterable(new Uint8Array());
        expect(uint8ArrayGenerator.match(matchObj)).toBeFalsy();

        matchObj[GENERATOR_TYPE] = Uint8Array;
        expect(uint8ArrayGenerator.match(matchObj)).toBeTruthy();


      });

    });

    describe('generate', () => {

      it('simple', async () => {

        const helloContent = fs.createReadStream(HELLO_PATH);
        const helloCid = await uint8ArrayGenerator.generate(trasformUint8Array(helloContent), DEFAULT_OPTS);

        expect(helloCid).toBeInstanceOf(CID);
        expect(helloCid.toString()).toBe('QmXxT7EkBJ3oRerJLWMeQ1pSne9EdVSZn1p1Bvn7KgwNTK');

        const emptyContent = fs.createReadStream(EMPTY_PATH);
        const emptyCid = await uint8ArrayGenerator.generate(trasformUint8Array(emptyContent), DEFAULT_OPTS);

        expect(emptyCid).toBeInstanceOf(CID);
        expect(emptyCid.toString()).toBe('QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH');

        const simpleContent = fs.createReadStream(SIMPLE_PATH, { highWaterMark: DEFAULT_OPTS.chunk });
        const simpleCid = await uint8ArrayGenerator.generate(trasformUint8Array(simpleContent), DEFAULT_OPTS);

        expect(simpleCid).toBeInstanceOf(CID);
        expect(simpleCid.toString()).toBe('QmaL1KiQRV8secNszpjjFPg722T53c77k2dz5UsNua59ZT');

        const simpleSlowContent = fs.createReadStream(SIMPLE_PATH);
        const simpleSlowCid = await uint8ArrayGenerator.generate(trasformUint8Array(simpleSlowContent), DEFAULT_OPTS);

        expect(simpleSlowCid).toBeInstanceOf(CID);
        expect(simpleSlowCid.toString()).toBe('QmaL1KiQRV8secNszpjjFPg722T53c77k2dz5UsNua59ZT');

      });

    });

  });

});

async function* trasformUint8Array(stream) {
  for await (const chunk of stream) {
    yield new Uint8Array(chunk);
  }
}

