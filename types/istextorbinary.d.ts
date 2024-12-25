declare module 'istextorbinary' {
    function isTextOrBinary(filename: string | null, buffer: Buffer): boolean;
    export = isTextOrBinary;
}
