/**
 * @fileOverview dagnode生成器测试
 * @name dag_node.test.js
 * @author kiba.x.zhao k<iba.rain@qq.com>
 * @license MIT
 */
'use strict';


const { DAGNode } = require('ipld-dag-pb');
const { UnixFS } = require('ipfs-unixfs');
const { GENERATOR_TYPE } = require('../../lib/constants');
const { DAGNodeGenerator, MODULE_KEY } = require('../../lib/dag_node');
const { createAsyncIterable } = require('../../lib/utils');
const CID = require('cids');
const faker = require('faker');

const DEFAULT_OPTS = {
  chunk: 262144,
  algHashName: 'sha2-256',
  version: 0,
  codec: 'dag-pb',
  multibaseName: 'base58btc',
};

class ModelClass {

}

describe('lib/dag_node', () => {

  it('MODULE_KEY', () => {
    expect(MODULE_KEY).toBe('ipfs-cid:DAGNodeGenerator');
  });

  describe('DAGNodeGenerator', () => {

    /** @type DAGNodeGenerator **/
    let dagNodeGenerator;

    beforeEach(() => {
      dagNodeGenerator = new DAGNodeGenerator();
    });

    describe('match', () => {

      it('simple', () => {
        expect(dagNodeGenerator.match({})).toBeFalsy();
        expect(dagNodeGenerator.match()).toBeFalsy();
        expect(dagNodeGenerator.match(faker.datatype.array())).toBeFalsy();
        expect(dagNodeGenerator.match(faker.datatype.boolean())).toBeFalsy();
        expect(dagNodeGenerator.match(faker.datatype.string())).toBeFalsy();
        expect(dagNodeGenerator.match(faker.datatype.number())).toBeFalsy();
        expect(dagNodeGenerator.match(faker.datatype.datetime())).toBeFalsy();
        expect(dagNodeGenerator.match(null)).toBeFalsy();
        expect(dagNodeGenerator.match(ModelClass)).toBeFalsy();
        expect(dagNodeGenerator.match(new ModelClass())).toBeFalsy();
        expect(dagNodeGenerator.match(() => {})).toBeFalsy();
        expect(dagNodeGenerator.match([ new DAGNode() ])).toBeFalsy();

        const matchObj = createAsyncIterable(new DAGNode());
        expect(dagNodeGenerator.match(matchObj)).toBeFalsy();

        matchObj[GENERATOR_TYPE] = DAGNode;
        expect(dagNodeGenerator.match(matchObj)).toBeTruthy();

      });

    });

    describe('generate', () => {

      it('simple', async () => {
        const unixFS = new UnixFS({ type: 'file' });
        const dagNode1 = new DAGNode(unixFS.marshal());
        const asyncNodes1 = createAsyncIterable(dagNode1);
        asyncNodes1[GENERATOR_TYPE] = DAGNode;
        const cid1 = await dagNodeGenerator.generate(asyncNodes1, DEFAULT_OPTS);
        expect(cid1).toBeInstanceOf(CID);

        const asyncNodes2 = createAsyncIterable(dagNode1, dagNode1);
        asyncNodes2[GENERATOR_TYPE] = DAGNode;
        const cid2 = await dagNodeGenerator.generate(asyncNodes2, DEFAULT_OPTS);
        expect(cid2).toBeInstanceOf(CID);

        const dagNodes = [];
        for (let i = 0; i < 175; i++) {
          dagNodes.push(dagNode1);
        }

        const asyncNodes3 = createAsyncIterable(...dagNodes);
        asyncNodes3[GENERATOR_TYPE] = DAGNode;
        const cid3 = await dagNodeGenerator.generate(asyncNodes3, DEFAULT_OPTS);
        expect(cid3).toBeInstanceOf(CID);
      });

    });

  });
});
