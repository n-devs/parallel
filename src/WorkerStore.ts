export class WorkerStore {
    private workerStore: Map<string, Function | null | undefined | void | Promise<any> | string | number | boolean> = new Map();
    private worker: Worker | null = null;
    private databaseName: string;
    private collectionName: string;
    constructor(worker: Worker | null, databaseName: string, collectionName: string) {
        this.worker = worker;
        this.databaseName = databaseName;
        this.collectionName = collectionName;

    }

    private generateKey(key: string): string {
        return `${key}.${this.databaseName}.${this.collectionName}`;
    }

    public set(key: string, value: Function | null | undefined | void | Promise<any> | string | number | boolean) {
        if (!this.worker) {
            throw new Error("Worker is not initialized");
        }

        // Post the message to the worker
        this.worker.postMessage({ action: 'set', type: key, databaseName: this.databaseName, collectionName: this.collectionName, data: value });
        this.workerStore.set(this.generateKey(key), value);
    }

    public get(key: string): Function | null | undefined | void | Promise<any> | string | number | boolean {
        if (!this.worker) {
            throw new Error("Worker is not initialized");
        }

        this.worker.postMessage({ action: 'get', type: key, databaseName: this.databaseName, collectionName: this.collectionName });
        return this.workerStore.get(this.generateKey(key));
    }

    public delete(key: string): boolean {
        if (!this.worker) {
            throw new Error("Worker is not initialized");
        }
        this.worker.postMessage({ action: 'delete', type: key, databaseName: this.databaseName, collectionName: this.collectionName });
        return this.workerStore.delete(this.generateKey(key));
    }

    public has(key: string): boolean {
        if (!this.worker) {
            throw new Error("Worker is not initialized");
        }
        this.worker.postMessage({ action: 'has', type: key, databaseName: this.databaseName, collectionName: this.collectionName });
        return this.workerStore.has(this.generateKey(key));
    }

    public clear() {
        if (!this.worker) {
            throw new Error("Worker is not initialized");
        }
        this.worker.postMessage({ action: 'clear', databaseName: this.databaseName, collectionName: this.collectionName });
        this.workerStore.clear();
    }

    public getAll(): Map<string, Function | null | undefined | void | Promise<any> | string | number | boolean> {
        return this.workerStore;
    }

    public get size(): number {
        return this.workerStore.size;
    }


}