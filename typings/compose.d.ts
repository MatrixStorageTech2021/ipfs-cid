export const MODULE_KEY: string;
/**
 * CID类型
 * @typedef { import("cids") } CID
 */
/**
 * 计算目标
 * @typedef { Uint8Array | Blob | String |  Iterable<Uint8Array> | Iterable<number> | AsyncIterable<Uint8Array> | ReadableStream<Uint8Array> } Target
 */
/**
 * 计算可选项
 * @typedef { Object } Opts
 * @property {Number} [chunk = 262144] 拆分文件大小
 * @property {String} [algHashName = "sha2-256"] 计算的hash算法名称
 * @property {Number} [version = 0] cid版本号
 * @property {String} [codec = "dag-pb"] cid编码
 * @property {String} [multibaseName = "base58btc"] multibase名称
 */
/**
 * 生成器
 * @interface CIDGenerator
 */
/**
 * 初始化
 * @function
 * @name CIDGenerator#init
* @param {CIDGenerator} generator 计算目标
* @returns {boolean} true:已经初始化/false:未初始化
 */
/**
 * 匹配方法
 * @function
 * @name CIDGenerator#match
* @param {Target} target 计算目标
* @returns {boolean} true:匹配/false:不匹配
 */
/**
 * 生成方法
 *
 * @async
 * @function
 * @name CIDGenerator#generate
* @param {Target} target 计算目标
* @param {Opts} opts 计算可选参数
* @returns {Promise<import("cids")>} 计算出的cid对象
*/
export class ComposeGenerator {
    /**
     * 创建计算器实例
     * @static
     * @return {ComposeGenerator}
     */
    static createInstance(): ComposeGenerator;
    /**
     * 引擎构造函数
     * @class
     * @param {Opts} [opts] 计算可选项
     */
    constructor(opts?: Opts);
    /**
     *装载cid生成器
     * @param {CIDGenerator} generator 生成器
     */
    mount(generator: any): void;
    /**
     *卸载cid生成器
     * @param {CIDGenerator} generator 生成器
     */
    umount(generator: any): void;
    /**
     *计算cid方法
     *
     * @asnyc
     * @param {Target} target 计算目标
     * @param {Opts} opts 计算可选项
     * @return {Promise<CID>} 生成的cid
     */
    generate(target: Target, opts?: Opts): Promise<CID>;
    /**
     * @private
     * @readonly
     * @type {CIDGenerator[]}
     */
    private readonly [GENERATORS];
    [OPTIONS]: Opts;
}
/**
 * CID类型
 */
export type CID = import("cids");
/**
 * 计算目标
 */
export type Target = Uint8Array | Blob | string | Iterable<Uint8Array> | Iterable<number> | AsyncIterable<Uint8Array> | ReadableStream<Uint8Array>;
/**
 * 计算可选项
 */
export type Opts = {
    /**
     * 拆分文件大小
     */
    chunk?: number;
    /**
     * 计算的hash算法名称
     */
    algHashName?: string;
    /**
     * cid版本号
     */
    version?: number;
    /**
     * cid编码
     */
    codec?: string;
    /**
     * multibase名称
     */
    multibaseName?: string;
};
declare const GENERATORS: unique symbol;
declare const OPTIONS: unique symbol;
export {};
