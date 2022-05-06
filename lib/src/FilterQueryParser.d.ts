import * as PEG from "pegjs";
import BaseAutoCompleteHandler from "./BaseAutoCompleteHandler";
import ParseTrace from "./ParseTrace";
import { ExtendedCodeMirror, HintInfo } from "./models/ExtendedCodeMirror";
import Expression from "./Expression";
import ParsedError from "./ParsedError";
export default class FilterQueryParser {
    autoCompleteHandler: BaseAutoCompleteHandler;
    lastError: PEG.PegjsError;
    parseTrace: ParseTrace;
    constructor();
    parse(query: string): Expression[] | ParsedError;
    private parseQuery;
    getSuggestions(query: string, cm: ExtendedCodeMirror): HintInfo[];
    putAndOR(query: string, cm: ExtendedCodeMirror): HintInfo[];
    setAutoCompleteHandler(autoCompleteHandler: BaseAutoCompleteHandler): void;
}
export interface ExtendedParser extends PEG.Parser {
}
