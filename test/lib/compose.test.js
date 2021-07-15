/**
 * @fileOverview 组合生成器测试代码
 * @name compose.test.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */


import { jest } from '@jest/globals';
import CID from 'cids';
import { ComposeGenerator, MODULE_KEY } from '../../lib/compose';

const DEFAULT_OPTS = {
  chunk: 262144,
  algHashName: 'sha2-256',
  version: 0,
  codec: 'dag-pb',
  multibaseName: 'base58btc',
};


describe('lib/compose', () => {

  it('MODULE_KEY', () => {
    expect(MODULE_KEY).toBe('ipfs-cid:ComposeGenerator');
  });

  describe('ComposeGenerator', () => {

    /**
     * @type {ComposeGenerator}
     */
    let compose;

    beforeEach(() => {
      compose = new ComposeGenerator();
    });

    describe('mount', () => {

      it('simple', async () => {
        const generator = { match: jest.fn(), generate: jest.fn() };
        compose.mount(generator);

        expect(generator.match).not.toBeCalled();
        expect(generator.generate).not.toBeCalled();

        compose.mount(generator);
        expect(generator.match).not.toBeCalled();
        expect(generator.generate).not.toBeCalled();

      });

      it('with init', async () => {

        const WRONG_MESG = `[${MODULE_KEY}] mount Error: init fatal`;
        const generator = { match: jest.fn(), generate: jest.fn() };
        const initGenerator = { init: jest.fn(), match: jest.fn(), generate: jest.fn() };
        const nextGenerator = { init: jest.fn(), match: jest.fn(), generate: jest.fn() };

        initGenerator.init.mockReturnValueOnce(true);
        nextGenerator.init.mockReturnValueOnce(false);

        compose.mount(generator);
        compose.mount(initGenerator);
        expect(() => compose.mount(nextGenerator)).toThrow(WRONG_MESG);


        expect(generator.match).not.toBeCalled();
        expect(generator.generate).not.toBeCalled();
        expect(initGenerator.init).toBeCalledTimes(1);
        expect(initGenerator.init).toBeCalledWith(generator);
        expect(initGenerator.match).not.toBeCalled();
        expect(initGenerator.generate).not.toBeCalled();
        expect(nextGenerator.init).toBeCalledTimes(2);
        expect(nextGenerator.init.mock.calls).toEqual([[ generator ], [ initGenerator ]]);
        expect(nextGenerator.match).not.toBeCalled();
        expect(nextGenerator.generate).not.toBeCalled();

      });


      it('with init fatal', async () => {
        const generator = { init: jest.fn(), match: jest.fn(), generate: jest.fn() };
        const WRONG_MESG = `[${MODULE_KEY}] mount Error: init fatal`;

        expect(() => compose.mount(generator)).toThrow(WRONG_MESG);

        expect(generator.init).not.toBeCalled();
        expect(generator.match).not.toBeCalled();
        expect(generator.generate).not.toBeCalled();

        generator.init.mockReturnValueOnce(false);
        expect(() => compose.mount(generator)).toThrow(WRONG_MESG);
        expect(generator.init).toBeCalledTimes(1);
        expect(generator.match).not.toBeCalled();
        expect(generator.generate).not.toBeCalled();

      });

    });

    describe('unmount', () => {

      it('simple', async () => {

        const WRONG_MESG = `[${MODULE_KEY}] generate Error: Not Support`;
        const generator = { match: jest.fn(), generate: jest.fn() };
        compose.mount(generator);
        compose.umount(generator);

        await expect(compose.generate({})).rejects.toThrow(WRONG_MESG);

        expect(generator.match).not.toBeCalled();
        expect(generator.generate).not.toBeCalled();

        compose.umount(generator);
        await expect(compose.generate({})).rejects.toThrow(WRONG_MESG);

        expect(generator.match).not.toBeCalled();
        expect(generator.generate).not.toBeCalled();
      });

    });

    describe('generate', () => {

      it('simple', async () => {

        const WRONG_MESG = `[${MODULE_KEY}] generate Error: Not Support`;
        const generator = { match: jest.fn(), generate: jest.fn() };
        compose.mount(generator);

        const target = Symbol();
        generator.match.mockReturnValue(false);
        await expect(compose.generate(target)).rejects.toThrow(WRONG_MESG);

        expect(generator.match).toBeCalledTimes(1);
        expect(generator.match).toBeCalledWith(target);
        expect(generator.generate).not.toBeCalled();
        generator.match.mockReset();

        const target1 = Symbol();
        generator.match.mockReturnValue(true);
        generator.generate.mockResolvedValueOnce(new CID('QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH'));
        await compose.generate(target1);

        expect(generator.match).toBeCalledTimes(1);
        expect(generator.match).toBeCalledWith(target1);
        expect(generator.generate).toBeCalledTimes(1);
        expect(generator.generate).toBeCalledWith(target1, DEFAULT_OPTS);
        generator.match.mockReset();
        generator.generate.mockReset();

        compose.mount(generator);
        generator.match.mockReturnValue(false);
        await expect(compose.generate(target)).rejects.toThrow(WRONG_MESG);

        expect(generator.match).toBeCalledTimes(2);
        expect(generator.match).toBeCalledWith(target);
        expect(generator.generate).not.toBeCalled();
        generator.match.mockReset();

        generator.match.mockReturnValue(true);
        generator.generate.mockResolvedValueOnce(new CID('QmbFMke1KXqnYyBBWxB74N4c5SBnJMVAiMNRcGu6x1AwQH'));
        await compose.generate(target1);

        expect(generator.match).toBeCalledTimes(1);
        expect(generator.match).toBeCalledWith(target1);
        expect(generator.generate).toBeCalledTimes(1);
        expect(generator.generate).toBeCalledWith(target1, DEFAULT_OPTS);
        generator.match.mockReset();
        generator.generate.mockReset();

      });

    });

  });

});
