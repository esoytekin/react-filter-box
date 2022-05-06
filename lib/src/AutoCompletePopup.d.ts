import * as CodeMirror from "codemirror";
import { HintResult, HintOptions, ExtendedCodeMirror, Completion, HintInfo } from "./models/ExtendedCodeMirror";
import * as React from "react";
export default class AutoCompletePopup {
    private cm;
    private needAutoCompletevalues;
    doc: CodeMirror.Doc;
    hintOptions: HintOptions;
    completionShow: boolean;
    appendSpace: boolean;
    customRenderCompletionItem: (self: HintResult, data: Completion, registerAndGetPickFunc: () => PickFunc) => React.ReactElement<any>;
    pick: (cm: ExtendedCodeMirror, self: HintResult, data: Completion) => string;
    constructor(cm: ExtendedCodeMirror, needAutoCompletevalues: (text: string) => HintInfo[]);
    private processText;
    private inClausePick;
    private onPick;
    private renderHintElement;
    private manualPick;
    private buildComletionObj;
    private findLastSeparatorPositionWithEditor;
    show(): void;
    hide(): void;
    private createHintOption;
}
interface PickFunc {
    (): void;
}
export {};
