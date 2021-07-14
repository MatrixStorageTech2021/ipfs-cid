export const MODULE_KEY: string;
export class Uint8ArrayGenerator {
    /**
     * 创建计算器实例
     * @static
     * @return {Uint8Generator}
     */
    static createInstance(): any;
    /**
     *初始化
     * @param {any} generator DAGNodeGenerator实例
     * @return {boolean} true:成功/false:失败
     */
    init(generator: any): boolean;
    /**
     *匹配方法
     * @param {import("./compose").Target} target 计算目标
     * @return {boolean} true:匹配/false:不匹配
     */
    match(target: import("./compose").Target): boolean;
    /**
     *
     * @param {AsyncIterable<Uint8Array>} target 计算目标
     * @param {import("./compose").Opts} opts 计算可选项
     * @return {import("cids")}
     */
    generate(target: AsyncIterable<Uint8Array>, opts: import("./compose").Opts): import("cids");
    [DAGNODE_GENERATOR]: any;
}
declare const DAGNODE_GENERATOR: unique symbol;
export {};
