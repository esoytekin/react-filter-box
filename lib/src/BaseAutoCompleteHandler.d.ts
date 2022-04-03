import * as PEG from "pegjs";
import { ExtendedParser } from "./FilterQueryParser";
import { HintInfo } from "./models/ExtendedCodeMirror";
import ParseTrace from "./ParseTrace";
export default class BaseAutoCompleteHandler {
    quote(text: string, type: string): string;
    buildDefaultObjOrGetOriginal(value: string | Object, type: string): HintInfo;
    handleParseError(parser: ExtendedParser, parseTrace: ParseTrace, error: PEG.PegjsError): HintInfo[];
    hasCategory(category: string): boolean;
    hasOperator(category: string, operator: string): boolean;
    needCategories(): string[];
    needOperators(lastOperator: string): string[];
    needValues(lastCategory: string, lastOperator: string): string[];
}
