import * as PEG from "pegjs";
import { ExtendedParser } from "./FilterQueryParser";
import { ExtendedCodeMirror, HintInfo } from "./models/ExtendedCodeMirror";
import ParseTrace from "./ParseTrace";
export default class BaseAutoCompleteHandler {
    quote(text: string, type: string): string;
    buildDefaultObjOrGetOriginal(value: string | Object, type: string, category?: string, operator?: string): HintInfo;
    handleParseError(parser: ExtendedParser, parseTrace: ParseTrace, error: PEG.PegjsError, cm: ExtendedCodeMirror): HintInfo[];
    hasCategory(category: string): boolean;
    hasOperator(category: string, operator: string): boolean;
    needCategories(): string[];
    needOperators(lastOperator: string): string[];
    needValues(lastCategory: string, lastOperator: string, cm: ExtendedCodeMirror): string[];
}
