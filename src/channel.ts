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
        let item = this.buffer.shift();
        this.notifySend();
        return item!;
    }

    tryRecv(): T | undefined {
        if (this.buffer.length === 0) return undefined;
        let item = this.buffer.shift();
        this.notifySend();
        return item;
    }

    async wait(): Promise<void> {
        if (this.buffer.length > 0) return;
        await new Promise<void>(resolve => this.recvResolvers.push(resolve));
    }

    /* Take up to max items from the channel.
     * If max is not specified, take all items.
     * Returns an array of items.
     * If the channel is closed, it will return all items in the buffer.
     *  If the channel is empty, it will return an empty array.
     */
    drain(max?: number | undefined): T[] {
        if (this.closed && this.buffer.length === 0) return [];
        if (max === undefined || max > this.buffer.length) {
            max = this.buffer.length;
        }
        let items = this.buffer.slice(0, max);
        this.buffer = this.buffer.slice(max);
        this.notifySend();
        return items;
    }

    close() {
        this.closed = true;
        this.notifyRecv();
        this.notifySend();
    }
}
