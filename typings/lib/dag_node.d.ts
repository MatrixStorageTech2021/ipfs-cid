/**
 * 生成可选项
 */
export type Opts = import("./compose").Opts;
export const MODULE_KEY: string;
export class DAGNodeGenerator {
    /**
     * 创建计算器实例
     * @static
     * @return {DAGNodeGenerator}
     */
    static createInstance(): DAGNodeGenerator;
    /**
     * 构造函数
     * @class
     * @param {Number} [maxLinks = 174] 最大link数量
     */
    constructor(maxLinks?: number);
    /**
     *匹配方法
     * @param {import("./compose").Target} target 计算目标
     * @return {boolean} true:匹配/false:不匹配
     */
    match(target: import("./compose").Target): boolean;
    /**
     * @async
     * @param {AsyncIterable<DAGNode>} target 计算目标
     * @param {import("./compose").Opts} opts 计算可选项
     * @return {Promise<CID>} 生成的cid对象
     */
    generate(target: AsyncIterable<DAGNode>, opts?: import("./compose").Opts): Promise<CID>;
    [MAX_LINKS]: number;
}
import { DAGNode } from "ipld-dag-pb/src/types";
import CID = require("cids");
declare const MAX_LINKS: unique symbol;
export {};
