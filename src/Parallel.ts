import { Database } from "./Database";
import { Fetch } from "./Fetch";
import { Fn } from "./Fn";
import { Store } from "./Store";
import { Cache } from "./Cache";

export class Parallel {
    public databasseWorker: Worker | null = null;
    public storeWorker: Worker | null = null;
    public fnWorker: Worker | null = null;
    public fetchWorker: Worker | null = null;
    public cacheWorker: Worker | null = null;

    constructor() { }

    public init() {
        this.databasseWorker = new Worker(new URL("./databases.worker.ts", import.meta.url), { type: "module" });
        this.storeWorker = new Worker(new URL("./store.worker.ts", import.meta.url), { type: "module" });
        this.fnWorker = new Worker(new URL("./fn.worker.ts", import.meta.url), { type: "module" });
        this.fetchWorker = new Worker(new URL("./fetch.worker.ts", import.meta.url), { type: "module" });
        this.cacheWorker = new Worker(new URL("./cache.worker.ts", import.meta.url), { type: "module" });

    }

    public database(name: string) {
        return new Database(this.databasseWorker, name);

    }

    public store() {
        return new Store(this.storeWorker)
    }

    public cache(name: string) {
        return new Cache(this.cacheWorker, name);
    }

    public fetch() {
        return new Fetch(this.fetchWorker)
    }

    public fn(key: string, _fn: Function) {
        return new Fn(this.fnWorker, key, _fn);
    }


}