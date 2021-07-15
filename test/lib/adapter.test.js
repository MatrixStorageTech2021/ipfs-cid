/**
 * @fileOverview 适配cid生成器测试
 * @name adapter.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import { jest } from '@jest/globals';
import { AdapterGenerator, MODULE_KEY } from '../../lib/adapter';
import { ComposeGenerator } from '../../lib/compose.js';
import { GENERATOR_TYPE } from '../../lib/constants.js';
import { createAsyncIterable, joinAsyncIterable } from '../../lib/utils.js';
import faker from 'faker';

class ModelClass {

}

describe('lib/adapter', () => {

  it('MODULE_KEY', () => {
    expect(MODULE_KEY).toBe('ipfs-cid:AdapterGenerator');
  });

  describe('AdapterGenerator', () => {

    /** @type AdapterGenerator **/
    let adapterGenerator;

    /** @type ComposeGenerator **/
    let composeGenerator;

    beforeEach(() => {
      composeGenerator = new ComposeGenerator();
      adapterGenerator = new AdapterGenerator(composeGenerator);
    });

    describe('match', () => {

      it('simple', () => {
        expect(adapterGenerator.match({})).toBeFalsy();
        expect(adapterGenerator.match({})).toBeFalsy();
        expect(adapterGenerator.match()).toBeFalsy();
        expect(adapterGenerator.match(faker.datatype.boolean())).toBeFalsy();
        expect(adapterGenerator.match(faker.datatype.string())).toBeFalsy();
        expect(adapterGenerator.match(faker.datatype.number())).toBeFalsy();
        expect(adapterGenerator.match(faker.datatype.datetime())).toBeFalsy();
        expect(adapterGenerator.match(null)).toBeFalsy();
        expect(adapterGenerator.match(ModelClass)).toBeFalsy();
        expect(adapterGenerator.match(new ModelClass())).toBeFalsy();
        expect(adapterGenerator.match(() => { })).toBeFalsy();

        expect(adapterGenerator.match(faker.datatype.array())).toBeTruthy();
        expect(generator()).toBeTruthy();
        const matchObj = createAsyncIterable(new Uint8Array());
        expect(adapterGenerator.match(matchObj)).toBeTruthy();

        matchObj[GENERATOR_TYPE] = Uint8Array;
        expect(adapterGenerator.match(matchObj)).toBeFalsy();

      });

    });

    describe('generate', () => {

      it('simple', async () => {

        const generateSpy = jest.spyOn(composeGenerator, 'generate');
        const cid = Symbol('cid');
        const opts = Symbol('opts');
        generateSpy.mockResolvedValue(cid);

        let res = await adapterGenerator.generate([], opts);
        expect(res).toBe(cid);
        expect(generateSpy).toBeCalledTimes(1);
        expect(generateSpy).toBeCalledWith(expect.anything(), opts);

        res = await adapterGenerator.generate(generator([]), opts);
        expect(res).toBe(cid);
        expect(generateSpy).toBeCalledTimes(2);
        expect(generateSpy).toBeCalledWith(expect.anything(), opts);

        res = await adapterGenerator.generate(joinAsyncIterable([]), opts);
        expect(res).toBe(cid);
        expect(generateSpy).toBeCalledTimes(3);
        expect(generateSpy).toBeCalledWith(expect.anything(), opts);

        res = await adapterGenerator.generate([ new Uint8Array([ 1, 2, 3, 4 ]) ], opts);
        expect(res).toBe(cid);
        expect(generateSpy).toBeCalledTimes(4);
        expect(generateSpy).toBeCalledWith(expect.anything(), opts);

        res = await adapterGenerator.generate(generator([ new Uint8Array([ 1, 2, 3, 4 ]) ]), opts);
        expect(res).toBe(cid);
        expect(generateSpy).toBeCalledTimes(5);
        expect(generateSpy).toBeCalledWith(expect.anything(), opts);

        res = await adapterGenerator.generate(joinAsyncIterable([ new Uint8Array([ 1, 2, 3, 4 ]) ]), opts);
        expect(res).toBe(cid);
        expect(generateSpy).toBeCalledTimes(6);
        expect(generateSpy).toBeCalledWith(expect.anything(), opts);

      });

    });

  });

});

function* generator(...args) {
  for (const item of args) {
    yield item;
  }
}
