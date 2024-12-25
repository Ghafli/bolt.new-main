export class Buffer {
    private buffer: string = ''
    push(chunk: string) {
        this.buffer += chunk
    }

    read(): string {
        const data = this.buffer
        this.buffer = ''
        return data
    }

    peek(): string {
        return this.buffer
    }
}
