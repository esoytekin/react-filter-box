import * as React from "react";
import * as CodeMirror from "codemirror";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/display/placeholder";
import "./FilterMode";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint.css";
import { ExtendedCodeMirror } from "./models/ExtendedCodeMirror";
import AutoCompletePopup from "./AutoCompletePopup";
export default class FilterInput extends React.Component<any, any> {
    options: CodeMirror.EditorConfiguration;
    codeMirror: ExtendedCodeMirror;
    doc: CodeMirror.Doc;
    autoCompletePopup: AutoCompletePopup;
    cursorPosition: CodeMirror.Position;
    static defaultProps: any;
    constructor(props: any);
    findLastSeparatorPositionWithEditor(): {
        line: number;
        ch: number;
    };
    private handlePressingAnyCharacter;
    private onSubmit;
    private codeMirrorRef;
    private handleEditorChange;
    clearInput(): void;
    andOrClick(): void;
    render(): JSX.Element;
}
