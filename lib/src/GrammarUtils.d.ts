declare class GrammarUtils {
    isSeparator(c: string): boolean;
    isWhiteSpace(c: string): boolean;
    findLastSeparatorIndex(text: string): number;
    needSpaceAfter(char: string): boolean;
    isLastCharacterWhiteSpace(text: string): boolean;
    stripEndWithNonSeparatorCharacters(text: string): string;
    getEndNotSeparatorCharacers(text: string): string;
}
declare const _default: GrammarUtils;
export default _default;
