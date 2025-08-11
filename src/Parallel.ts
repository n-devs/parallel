import { Database } from "./Database";

export class Parallel {
    public worker: Worker | null = null;
    constructor() { }

    public init() {
        this.worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
    }

    public database(name: string) {
        // this.worker?.postMessage({ type: 'database', name: name }) || null;
        return new Database(this.worker, name);

    }

    public store(name: string) {
        return this.worker?.postMessage({ type: 'store', name: name }) || null;
    }

    public cache(name: string) {
        return
    }

    public fetch(name: string) {
        return
    }

    public fn(name: string) {
        return
    }


}