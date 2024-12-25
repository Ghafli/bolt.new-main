export function stripIndent(str: string): string {
    if (!str) {
        return '';
    }
    const match = str.match(/^[ \t]*(?=\S)/gm);
    if (!match) {
        return str;
    }
    const indent = Math.min(...match.map(x => x.length));
    const regex = new RegExp(`^[ \\t]{${indent}}`, 'gm');
    return str.replace(regex, '');
}
