export default class Channel<T> {
    private buffer: T[] = [];
    private closed = false;

    // Promises for waiting senders/receivers
    private recvResolvers: ((value: void) => void)[] = [];
    private sendResolvers: ((value: void) => void)[] = [];

    constructor(private size?: number) {}

    private notifyRecv() {
        this.recvResolvers.forEach(r => r());
        this.recvResolvers = [];
    }

    private notifySend() {
        this.sendResolvers.forEach(r => r());
        this.sendResolvers = [];
    }

    async send(value: T): Promise<void> {
        if (this.closed) throw new Error("Channel closed");
        if (this.size && this.buffer.length >= this.size) {
            await new Promise<void>(resolve => this.sendResolvers.push(resolve));
        }
        if (this.closed) throw new Error("Channel closed");
        this.buffer.push(value);
        this.notifyRecv();
    }

    trySend(value: T): boolean {
        if (this.closed) return false;
        if (this.size && this.buffer.length >= this.size) return false;
        this.buffer.push(value);
        this.notifyRecv();
        return true;
    }

    async recv(): Promise<T> {
        while (this.buffer.length === 0) {
            if (this.closed) throw new Error("Channel closed");
            await new Promise<void>(resolve => this.recvResolvers.push(resolve));
        }
        return this.buffer.shift()!;
    }

    tryRecv(): T | undefined {
        if (this.buffer.length === 0) return undefined;
        return this.buffer.shift();
    }

    async wait(): Promise<void> {
        if (this.buffer.length > 0) return;
        await new Promise<void>(resolve => this.recvResolvers.push(resolve));
    }

    close() {
        this.closed = true;
        this.notifyRecv();
        this.notifySend();
    }
}
