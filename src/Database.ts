export class Database {
    private worker: Worker | null = null;
    private databaseName: string;
    constructor(worker: Worker | null = null, name: string) {
        this.worker = worker;
        this.databaseName = name;
        this.worker?.postMessage({
            action: 'INSERT',
            method: 'POST',
            key: 'DATABASE',
            data: {
                databaseName: this.databaseName
            }
        });
    }

    public collecton(name: string) {
        if (!this.worker) {
            throw new Error("Worker is not initialized");
        }
        return new Collection(this.worker, this.databaseName, name);
    }
}

class Collection {
    private worker: Worker;
    private databaseName: string;
    private collectionName: string;
    constructor(worker: Worker, databaseName: string, collectionName: string) {
        this.worker = worker;
        this.databaseName = databaseName;
        this.collectionName = collectionName;
    }


    public insert(data: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.worker.postMessage({
                action: 'INSERT',
                method: 'POST',
                key: 'COLLECTION',
                data: {
                    databaseName: this.databaseName,
                    collectionName: this.collectionName,
                    data: data
                }
            });

            const handleMessage = (event: MessageEvent) => {
                const { action, method, key, data } = event.data;
                if (
                    action === 'INSERT' &&
                    method === 'GET' &&
                    key === 'COLLECTION' &&
                    data.databaseName === this.databaseName &&
                    data.collectionName === this.collectionName
                ) {
                    this.worker.removeEventListener('message', handleMessage);
                    if (data.data.status === 'error') {
                        reject(data.data)
                    } else {
                        resolve(data.data);
                    }

                }

            };

            this.worker.addEventListener('message', handleMessage);
        });
    }

    public get(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.worker.postMessage({
                action: 'GET_ALL',
                method: 'POST',
                key: 'COLLECTION',
                data: {
                    databaseName: this.databaseName,
                    collectionName: this.collectionName
                }
            });

            const handleMessage = (event: MessageEvent) => {
                const { action, method, key, data } = event.data;
                if (
                    action === 'GET_ALL' &&
                    method === 'GET' &&
                    key === 'COLLECTION' &&
                    data.databaseName === this.databaseName &&
                    data.collectionName === this.collectionName
                ) {
                    this.worker.removeEventListener('message', handleMessage);
                    if (data.data.status === 'error') {
                        reject(data.data)
                    } else {
                        resolve(data.data);
                    }
                }
            };

            this.worker.addEventListener('message', handleMessage);
        });
    };

    public getMemoryCache(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.worker.postMessage({
                action: 'GET_ALL_MEMORY_CACHE',
                method: 'POST',
                key: 'COLLECTION',
                data: {
                    databaseName: this.databaseName,
                    collectionName: this.collectionName
                }
            });

            const handleMessage = (event: MessageEvent) => {
                const { action, method, key, data } = event.data;
                if (
                    action === 'GET_ALL_MEMORY_CACHE' &&
                    method === 'GET' &&
                    key === 'COLLECTION' &&
                    data.databaseName === this.databaseName &&
                    data.collectionName === this.collectionName
                ) {
                    this.worker.removeEventListener('message', handleMessage);
                    if (data.data.status === 'error') {
                        reject(data.data)
                    } else {
                        resolve(data.data);
                    }
                }
            };

            this.worker.addEventListener('message', handleMessage);
        });
    };

    public update(query: any, data: any) {
        if (this.worker) {
            this.worker.postMessage({ type: 'database_collection_update', database: this.databaseName, collection: this.collectionName, query, data });
        }
        return new Promise((resolve, reject) => {
            this.worker!.postMessage({
                action: 'UPDATE',
                method: 'POST',
                key: 'COLLECTION',
                data: {
                    databaseName: this.databaseName,
                    collectionName: this.collectionName,
                    query: query,
                    data: data
                }
            });
            const handleMessage = (event: MessageEvent) => {
                const { action, method, key, data } = event.data;
                if (
                    action === 'UPDATE' &&
                    method === 'GET' &&
                    key === 'COLLECTION' &&
                    data.databaseName === this.databaseName &&
                    data.collectionName === this.collectionName
                ) {
                    this.worker.removeEventListener('message', handleMessage);
                    if (data.data.status === 'error') {
                        reject(data.data)
                    } else {
                        resolve(data.data);
                    }
                }
            };
            this.worker.addEventListener('message', handleMessage);
        });
    }

    public delete(query: any) {
        return new Promise((resolve, reject) => {
            this.worker.postMessage({
                action: 'DELETE',
                method: 'POST',
                key: 'COLLECTION',
                data: {
                    databaseName: this.databaseName,
                    collectionName: this.collectionName,
                    query: query
                }
            });

            const handleMessage = (event: MessageEvent) => {
                const { action, method, key, data } = event.data;
                if (
                    action === 'DELETE' &&
                    method === 'GET' &&
                    key === 'COLLECTION' &&
                    data.databaseName === this.databaseName &&
                    data.collectionName === this.collectionName
                ) {
                    this.worker.removeEventListener('message', handleMessage);
                    if (data.data.status === 'error') {
                        reject(data.data)
                    } else {
                        resolve(data.data);
                    }
                }
            };

            this.worker.addEventListener('message', handleMessage);
        });

    }

    public find(query: any) {
        return new Promise((resolve, reject) => {
            this.worker.postMessage({
                action: 'FIND',
                method: 'POST',
                key: 'COLLECTION',
                data: {
                    databaseName: this.databaseName,
                    collectionName: this.collectionName,
                    query: query
                }
            });

            const handleMessage = (event: MessageEvent) => {
                const { action, method, key, data } = event.data;
                if (
                    action === 'FIND' &&
                    method === 'GET' &&
                    key === 'COLLECTION' &&
                    data.databaseName === this.databaseName &&
                    data.collectionName === this.collectionName
                ) {
                    this.worker.removeEventListener('message', handleMessage);
                    if (data.data.status === 'error') {
                        reject(data.data)
                    } else {
                        resolve(data.data);
                    }
                }
            };

            this.worker.addEventListener('message', handleMessage);
        });
    }

    public findMemoryCache(query: any) {
        return new Promise((resolve, reject) => {
            this.worker.postMessage({
                action: 'FIND_MEMORY_CACHE',
                method: 'POST',
                key: 'COLLECTION',
                data: {
                    databaseName: this.databaseName,
                    collectionName: this.collectionName,
                    query: query
                }
            });

            const handleMessage = (event: MessageEvent) => {
                const { action, method, key, data } = event.data;
                if (
                    action === 'FIND_MEMORY_CACHE' &&
                    method === 'GET' &&
                    key === 'COLLECTION' &&
                    data.databaseName === this.databaseName &&
                    data.collectionName === this.collectionName
                ) {
                    this.worker.removeEventListener('message', handleMessage);
                    if (data.data.status === 'error') {
                        reject(data.data)
                    } else {
                        resolve(data.data);
                    }
                }
            };

            this.worker.addEventListener('message', handleMessage);
        });
    }

    public filter(query: any) {
        return new Promise((resolve, reject) => {
            this.worker.postMessage({
                action: 'FILTER',
                method: 'POST',
                key: 'COLLECTION',
                data: {
                    databaseName: this.databaseName,
                    collectionName: this.collectionName,
                    query: query
                }
            });

            const handleMessage = (event: MessageEvent) => {
                const { action, method, key, data } = event.data;
                if (
                    action === 'FILTER' &&
                    method === 'GET' &&
                    key === 'COLLECTION' &&
                    data.databaseName === this.databaseName &&
                    data.collectionName === this.collectionName
                ) {
                    this.worker.removeEventListener('message', handleMessage);
                    if (data.data.status === 'error') {
                        reject(data.data)
                    } else {
                        resolve(data.data);
                    }
                }
            };

            this.worker.addEventListener('message', handleMessage);
        });
    }

    public filterMemoryCache(query: any) {
        return new Promise((resolve, reject) => {
            this.worker.postMessage({
                action: 'FILTER_MEMORY_CACHE',
                method: 'POST',
                key: 'COLLECTION',
                data: {
                    databaseName: this.databaseName,
                    collectionName: this.collectionName,
                    query: query
                }
            });

            const handleMessage = (event: MessageEvent) => {
                const { action, method, key, data } = event.data;
                if (
                    action === 'FILTER_MEMORY_CACHE' &&
                    method === 'GET' &&
                    key === 'COLLECTION' &&
                    data.databaseName === this.databaseName &&
                    data.collectionName === this.collectionName
                ) {
                    this.worker.removeEventListener('message', handleMessage);
                    if (data.data.status === 'error') {
                        reject(data.data)
                    } else {
                        resolve(data.data);
                    }
                }
            };

            this.worker.addEventListener('message', handleMessage);
        });
    }

    public fn(fn: Function) {
        return new Promise((resolve, reject) => {
            this.worker.postMessage({
                action: 'FUNCTION',
                method: 'POST',
                key: 'COLLECTION',
                data: {
                    databaseName: this.databaseName,
                    collectionName: this.collectionName,
                    fn: fn.toString()
                }
            });

            const handleMessage = (event: MessageEvent) => {
                const { action, method, key, data } = event.data;
                if (
                    action === 'FUNCTION' &&
                    method === 'GET' &&
                    key === 'COLLECTION' &&
                    data.databaseName === this.databaseName &&
                    data.collectionName === this.collectionName
                ) {
                    this.worker.removeEventListener('message', handleMessage);
                    if (data.data.status === 'error') {
                        reject(data.data)
                    } else {
                        resolve(data.data);
                    }
                }
            };

            this.worker.addEventListener('message', handleMessage);
        });
    }

    public fnMemoryCache(fn: Function) {
        return new Promise((resolve, reject) => {
            this.worker.postMessage({
                action: 'FUNCTION_MEMORY_CACHE',
                method: 'POST',
                key: 'COLLECTION',
                data: {
                    databaseName: this.databaseName,
                    collectionName: this.collectionName,
                    fn: fn.toString()
                }
            });

            const handleMessage = (event: MessageEvent) => {
                const { action, method, key, data } = event.data;
                if (
                    action === 'FUNCTION_MEMORY_CACHE' &&
                    method === 'GET' &&
                    key === 'COLLECTION' &&
                    data.databaseName === this.databaseName &&
                    data.collectionName === this.collectionName
                ) {
                    this.worker.removeEventListener('message', handleMessage);
                    if (data.data.status === 'error') {
                        reject(data.data)
                    } else {
                        resolve(data.data);
                    }
                }
            };

            this.worker.addEventListener('message', handleMessage);
        });
    }
}