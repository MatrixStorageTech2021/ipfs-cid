export const MODULE_KEY: string;
export class AdapterGenerator {
    /**
     * 构造函数
     * @class
     * @param {ComposeGenerator} generator 组合生成器
     */
    constructor(generator: ComposeGenerator);
    /**
     *匹配方法
     * @param {import("./compose").Target} target 计算目标
     * @return {boolean} true:匹配/false:不匹配
     */
    match(target: import("./compose").Target): boolean;
    /**
     * @async
     * @param {Array<any>| Iterable<any> | AsyncIterable<any>} target 计算目标
     * @param {import("./compose").Opts} opts 计算可选项
     * @return {Promise<CID>} 生成的cid对象
     */
    generate(target: Array<any> | Iterable<any> | AsyncIterable<any>, opts?: import("./compose").Opts): Promise<any>;
    [COMPOSE_GENERATOR]: ComposeGenerator;
}
declare const COMPOSE_GENERATOR: unique symbol;
import { ComposeGenerator } from "./compose.js";
export {};
