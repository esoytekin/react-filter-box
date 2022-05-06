import * as CodeMirror from "codemirror";
import * as _ from "lodash";
import {
    HintResult,
    HintFunc,
    HintOptions,
    ExtendedCodeMirror,
    Completion,
    HintInfo,
} from "./models/ExtendedCodeMirror";
import grammarUtils from "./GrammarUtils";
import * as ReactDOM from "react-dom";
import * as React from "react";

export default class AutoCompletePopup {
    doc: CodeMirror.Doc;
    hintOptions: HintOptions;
    completionShow = false;
    appendSpace = true;
    customRenderCompletionItem: (
        self: HintResult,
        data: Completion,
        registerAndGetPickFunc: () => PickFunc
    ) => React.ReactElement<any>;
    pick: (
        cm: ExtendedCodeMirror,
        self: HintResult,
        data: Completion
    ) => string;

    constructor(
        private cm: ExtendedCodeMirror,
        private needAutoCompletevalues: (text: string) => HintInfo[]
    ) {
        this.doc = cm.getDoc();

        cm.on("endCompletion", () => {
            this.completionShow = false;
        });

        this.hintOptions = this.createHintOption();
    }

    private processText(value: string | Object): any | Object {
        if (!_.isString(value)) {
            return value;
        }
        if (grammarUtils.needSpaceAfter(value as string)) {
            return value + " ";
        }

        return value;
    }

    private inClausePick(
        cm: any,
        self: any,
        data: Completion,
        value: string | Object
    ) {
        if (data.type !== "value") {
            return value;
        }

        const { operator } = data;

        if (operator !== "in" && operator !== "!in") {
            return value;
        }

        if (data.value === '","') {
            const doc = cm.getDoc();
            const text: string = doc.getRange({ line: 0, ch: 0 }, self.from);

            cm.replaceRange(
                text.trim(),
                { line: 0, ch: 0 },
                self.to,
                "complete"
            );

            return ",";
        }

        if (data.value === '"END"') {
            const doc = cm.getDoc();
            const text: string = doc.getRange({ line: 0, ch: 0 }, self.from);

            cm.replaceRange(
                text.trim(),
                { line: 0, ch: 0 },
                self.to,
                "complete"
            );
            return '"';
        }

        const doc = cm.getDoc();
        const currentCursor = doc.getCursor();
        const text: string = doc.getRange({ line: 0, ch: 0 }, self.from);

        const lastIndexIN = text.lastIndexOf("in");

        const userInput = doc.getRange(self.from, self.to);
        const enteredValue = doc
            .getRange({ line: 0, ch: lastIndexIN + 3 }, currentCursor)
            .replace(userInput, "");

        const val = typeof value === "string" ? value.replace(/"/g, "") : value;

        if (_.isEmpty(enteredValue)) {
            return `"${val}`;
        }

        return `${val}`;
    }

    private onPick(cm: ExtendedCodeMirror, self: HintResult, data: Completion) {
        var value = data.value;

        if (this.pick && data.value !== '","' && data.value !== '"END"') {
            value = this.pick(cm, self, data);
        }

        value = this.inClausePick(cm, self, data, value);

        if (typeof value !== "string") {
            return;
        }

        cm.replaceRange(
            this.processText(value),
            self.from,
            self.to,
            "complete"
        );
    }

    private renderHintElement(
        element: any,
        self: HintResult,
        data: Completion
    ) {
        var div = document.createElement("div");
        var className = ` hint-value cm-${data.type}`;
        var registerAndGetPickFunc = () => {
            //hack with show-hint code mirror https://github.com/codemirror/CodeMirror/blob/master/addon/hint/show-hint.js
            // to prevent handling click event
            element.className += " custom";
            setTimeout(() => {
                element.hintId = null;
            }, 0);

            return this.manualPick.bind(this, self, data);
        };
        let val = data.value;
        if (
            data.value &&
            typeof data.value === "string" &&
            data.value.indexOf('"') > -1
        ) {
            val = data.value.replace(/"/g, "");
        }

        if (this.customRenderCompletionItem) {
            ReactDOM.render(
                this.customRenderCompletionItem(
                    self,
                    data,
                    registerAndGetPickFunc
                ),
                div
            );
        } else {
            ReactDOM.render(<div className={className}>{val}</div>, div);
        }

        element.appendChild(div);
    }

    private manualPick(self: HintResult, data: Completion, value: string) {
        var completionControl = this.cm.state.completionActive;
        if (completionControl == null) return;

        var index = self.list.indexOf(data);
        data.hint = (
            cm: ExtendedCodeMirror,
            self: HintResult,
            data: Completion
        ) => {
            cm.replaceRange(
                this.processText(value),
                self.from,
                self.to,
                "complete"
            );
        };
        completionControl.pick(self, index);
    }

    private buildComletionObj(info: HintInfo): Completion {
        return {
            value: info.value,
            type: info.type,
            category: info.category,
            operator: info.operator,
            hint: this.onPick.bind(this),
            render: this.renderHintElement.bind(this),
        };
    }

    private findLastSeparatorPositionWithEditor() {
        var doc = this.cm.getDoc();
        var currentCursor = doc.getCursor();
        var text = doc.getRange({ line: 0, ch: 0 }, currentCursor);
        var index = grammarUtils.findLastSeparatorIndex(text);
        return {
            line: currentCursor.line,
            ch: currentCursor.ch - (text.length - index) + 1,
        };
    }

    show() {
        var cursor = this.doc.getCursor();
        var text = this.doc.getRange({ line: 0, ch: 0 }, cursor);
        this.hintOptions.hintValues = this.needAutoCompletevalues(text);

        this.cm.showHint(this.hintOptions);
        this.completionShow = true;
    }

    hide() {
        this.cm.showHint(null);
    }

    private createHintOption() {
        var hintOptions = new HintOptions();

        hintOptions.hint = (() => {
            var { hintValues } = hintOptions;
            var doc = this.cm.getDoc();
            var cursor = doc.getCursor();
            var lastSeparatorPos = this.findLastSeparatorPositionWithEditor();
            var text = doc.getRange(lastSeparatorPos, cursor);

            var values = hintValues;
            if (text) {
                values = _.filter(hintValues, (f) => {
                    var value = f.value as string;
                    return _.isString(f.value)
                        ? _.startsWith(
                              value.replace(/"/g, "").toLowerCase(),
                              text.toLowerCase()
                          )
                        : true;
                });
            }

            return {
                list: _.map(values, (c) => this.buildComletionObj(c)),
                from: lastSeparatorPos,
                to: cursor,
            };
        }) as HintFunc;

        hintOptions.hint.supportsSelection = true;

        return hintOptions;
    }
}

interface PickFunc {
    (): void;
}
