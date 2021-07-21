export const MODULE_KEY: string;
export class BufferGenerator {
    /**
     * 创建计算器实例
     * @static
     * @return {BufferGenerator}
     */
    static createInstance(): BufferGenerator;
    /**
     *初始化
     * @param {any} generator Uint8ArrayGenerator实例
     * @return {boolean} true:成功/false:失败
     */
    init(generator: any): boolean;
    /**
     *匹配方法
     * @param {import("../lib/compose").Target} target 计算目标
     * @return {boolean} true:匹配/false:不匹配
     */
    match(target: import("../lib/compose").Target): boolean;
    /**
     *
     * @param {AsyncIterable<Buffer>} target 计算目标
     * @param {import("../lib/compose").Opts} opts 计算可选项
     * @return {import("cids")}
     */
    generate(target: AsyncIterable<Buffer>, opts: import("../lib/compose").Opts): import("cids");
    [UINT8ARRAY_GENERATOR]: any;
}
declare const UINT8ARRAY_GENERATOR: unique symbol;
export {};
