export class Database {
    private worker: Worker | null = null;;
    private databaseName: string;
    constructor(worker: Worker | null = null, name: string) {
        this.worker = worker;
        this.databaseName = name;
        this.worker?.postMessage({ type: 'database', name: this.name });
    }

    public collecton(name: string) {
        return new Collection(this.worker, this.databaseName, name);
    }
}

class Collection {
    private worker: Worker | null = null;
    private databaseName: string;
    private collectionName: string;
    constructor(worker: Worker | null = null, databaseName: string, collectionName: string) {
        this.worker = worker;
        this.databaseName = databaseName;
        this.collectionName = collectionName;
    }

    public insert(data: any) {
        this.worker?.postMessage({ type: 'database_collection_insert', database: this.databaseName, collection: this.collectionName, data });
    }

    public get() {

        if (this.worker) {
            this.worker?.postMessage({ type: 'database_collection_get',  database: this.databaseName, collection: this.collectionName, });
            this.worker.onmessage = (event) => {
                const { type, collection } = event.data;
                if (type === 'database_collection_get' && collection === this.collectionName) {

                    return event.data.data;
                }
            };
        }

    };


    public update(query: any, data: any) {
        return new Promise((resolve, reject) => {
            this.worker?.postMessage({ type: 'database_collection_update', collection: this.name, query, data });
            resolve(true);
        });
    }

    public delete(query: any) {
        return new Promise((resolve, reject) => {
            this.worker?.postMessage({ type: 'database_collection_delete', collection: this.name, query });
            resolve(true);
        });
    }

    public find(query: any) {
        return new Promise((resolve, reject) => {
            this.worker?.postMessage({ type: 'database_collection_find', collection: this.name, query });
            resolve([]);
        });
    }

    public filter(query: any) {
        return new Promise((resolve, reject) => {
            this.worker?.postMessage({ type: 'database_collection_filter', collection: this.name, query });
            resolve([]);
        });
    }

    public fn(fn: Function) {
        return new Promise((resolve, reject) => {
            this.worker?.postMessage({ type: 'database_collection_fn', collection: this.name, fn });
            resolve([]);
        });
    }
}