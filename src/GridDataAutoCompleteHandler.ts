import BaseAutoCompleteHandler from "./BaseAutoCompleteHandler";
import Expression from "./Expression";
import * as _ from "lodash";
import { ExtendedCodeMirror } from "./models/ExtendedCodeMirror";

export default class GridDataAutoCompleteHandler extends BaseAutoCompleteHandler {
    parseResult: Expression[];
    categories: string[];
    cache: any = {};

    constructor(protected data: any[], protected options?: Option[]) {
        super();

        this.parseResult = null;

        this.categories = _.map(this.options, (f) => {
            if (f.columnText) return f.columnText;
            return f.columnField;
        });
    }

    hasCategory(category: string): boolean {
        var found = _.find(this.options, (f) => {
            return category === f.columnField || category === f.columnText;
        });

        return found !== undefined;
    }

    hasOperator(category: string, operator: string): boolean {
        return this.needOperators(category).indexOf(operator) >= 0;
    }

    needCategories() {
        return this.categories;
    }

    needOperators(parsedCategory: string) {
        // parsedCategory = this.tryToGetFieldCategory(parsedCategory);
        var found = _.find(this.options, (f) => {
            return (
                f.customOperatorFunc != null &&
                (f.columnText == parsedCategory ||
                    f.columnField == parsedCategory)
            );
        });

        if (found) {
            return found.customOperatorFunc(parsedCategory);
        }

        return ["==", "!=", "contains", "!contains"];
    }

    needValues(
        parsedCategory: string,
        parsedOperator: string,
        cm: ExtendedCodeMirror
    ): any[] {
        // parsedCategory = this.tryToGetFieldCategory(parsedCategory);
        var found = _.find(
            this.options,
            (f) =>
                f.columnField == parsedCategory ||
                f.columnText == parsedCategory
        );

        if (found && found.type == "selection" && this.data != null) {
            if (!this.cache[found.columnField]) {
                this.cache[found.columnField] = _.chain(this.data)
                    .map((f) => f[found.columnField])
                    .uniq()
                    .sort()
                    .value();
            }
            return this.cache[found.columnField];
        }

        if (found && found.customValuesFunc) {
            return found.customValuesFunc(found.columnField, parsedOperator);
        }

        return [];
    }
}

export interface Option {
    columnField: string;
    columnText?: string;
    type: string;
    customOperatorFunc?: (category: string) => string[];
    customValuesFunc?: (category: string, operator: string) => string[];
}
