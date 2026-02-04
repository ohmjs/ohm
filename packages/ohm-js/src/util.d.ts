export function awaitBuiltInRules(cb: any): void;
export function announceBuiltInRules(grammar: any): void;
export function getLineAndColumn(str: any, offset: any): {
    offset: any;
    lineNum: number;
    colNum: number;
    line: any;
    prevLine: any;
    nextLine: any;
    toString: typeof lineAndColumnToMessage;
};
export function getLineAndColumnMessage(str: any, offset: any, ...ranges: any[]): string;
export function uniqueId(prefix: any): string;
declare function lineAndColumnToMessage(...ranges: any[]): string;
export {};
//# sourceMappingURL=util.d.ts.map