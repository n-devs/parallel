// worker-db.ts
// IndexedDB helper functions for create, update, find, filter, delete, get
// const memory: Map<string, any> = new Map()
export class IndexedDatabase {
    databaseName: string = '';
    db: IDBDatabase | null = null;
    onerror: any;
    indexedDB: IDBOpenDBRequest | null = null
    constructor() {
        // Initialization code if needed          
    }

    database(databaseName: string): IndexedDatabaseColection {
        this.databaseName = databaseName;
        this.indexedDB = indexedDB.open(this.databaseName);
        this.onerror = this.indexedDB.error
        this.indexedDB.onerror = () => this.indexedDB!.error;
        this.indexedDB.onsuccess = () => {
            this.db = this.indexedDB!.result;
        };

        return new IndexedDatabaseColection(this.indexedDB, this.db, databaseName);
    }

}

export class IndexedDatabaseColection {
    private database: IDBDatabase | null = null;
    private databaseName: string = '';
    private indexedDB: IDBOpenDBRequest | null = null;

    constructor(indexedDB: IDBOpenDBRequest | null = null, database: IDBDatabase | null = null, databaseName: string = '') {
        this.indexedDB = indexedDB;
        this.database = database;
        this.databaseName = databaseName;
    }

    public collection(collectionName: string) {
        if (!this.database) {
            throw new Error("Database not initialized");
        }
        return new Colection(this.database, this.databaseName, collectionName);
    }

    public get() {
        if (!this.database) {
            throw new Error("Database not initialized");
        }
        return new Promise<any>((resolve, reject) => {
            resolve(this.indexedDB); // Return an empty array or fetch actual data if needed
        });
    }

}


class Colection {
    private database: IDBDatabase | null = null;
    private collectionName: string = '';
    private databaseName: string = '';
    private memoryCache: Map<string, any> = new Map();
    constructor(database: IDBDatabase | null = null, databaseName: string, collectionName: string) {

        this.database = database;
        this.databaseName = databaseName;
        this.collectionName = collectionName;
    }

    private toBuffer(data: any): Uint8Array {
        const json = JSON.stringify(data);
        const encoder = new TextEncoder();
        return encoder.encode(json);
    }

    private fromBuffer(buffer: Uint8Array): any {
        const decoder = new TextDecoder();
        const json = decoder.decode(buffer);
        return JSON.parse(json);
    }

    private generateKey(id: string): string {
        return `${this.databaseName}.${this.collectionName}.${id}`;
    }

    public get() {
        return new Promise<any>((resolve, reject) => {
            if (!this.database) {
                reject(new Error("Database not initialized"))
            }

            const tx = this.database!.transaction(this.collectionName, 'readonly');
            const store = tx.objectStore(this.collectionName);
            resolve(store)

        });
    }



    public insert(data: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (!this.database) {
                reject(new Error("Database not initialized"));
                return;
            }

            const tx = this.database.transaction(this.collectionName, 'readwrite');
            const store = tx.objectStore(this.collectionName);
            const request = store.add(this.toBuffer(data));
            request.onsuccess = (event: any) => {
                const id = event.target.result;
                this.memoryCache.set(this.generateKey(id), data);
                console.log("Data inserted successfully");
                resolve(true);
            };
            request.onerror = () => {
                console.error("Error inserting data:", request.error);
                reject(request.error);
            };
        });
    }

    public update(query: any, data: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (!this.database) {
                reject(new Error("Database not initialized"));
                return;
            }
            const tx = this.database.transaction(this.collectionName, 'readwrite');
            const store = tx.objectStore(this.collectionName);
            const getReq = store.get(query.id);
            getReq.onsuccess = () => {
                const record = getReq.result;
                if (record) {
                    const updated = { ...this.fromBuffer(record.value), ...data };
                    this.memoryCache.set(this.generateKey(query.id), updated);
                    const putReq = store.put(this.toBuffer(updated), query.id);
                    putReq.onsuccess = () => {
                        console.log("Data updated successfully");
                        resolve(true);
                    };
                    putReq.onerror = () => {
                        console.error("Error updating data:", putReq.error);
                        reject(putReq.error);
                    };
                } else {
                    reject(new Error("Record not found"));
                }
            };
            getReq.onerror = () => {
                console.error("Error finding data:", getReq.error);
                reject(getReq.error);
            };
        });
    }

    public find(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.database) {
                reject(new Error("Database not initialized"));
                return;
            }
            const tx = this.database.transaction(this.collectionName, 'readonly');
            const store = tx.objectStore(this.collectionName);
            const request = store.get(query.id);
            request.onsuccess = () => resolve(this.fromBuffer(request.result.value));
            request.onerror = () => reject(request.error);
        });
    }

    public findMemoryCache(query: Record<string, any>): Promise<any> {
        return new Promise((resolve) => {
            const keys = Object.keys(query);
            if (keys.includes('id')) {
                resolve(this.memoryCache.get(this.generateKey(query.id)) ?? null);
            } else {
                for (const [, items] of this.memoryCache.entries()) {
                    const found = Array.isArray(items)
                        ? items.find((item: any) =>
                            Object.entries(query).every(([key, value]) => item[key] === value)
                        )
                        : (Object.entries(query).every(([key, value]) => items[key] === value) ? items : undefined);
                    if (found) {
                        resolve(found);
                        return;
                    }
                }
                resolve(null);
            }
        });
    }
    public filter(query: any): Promise<any[]> {
        return new Promise((resolve, reject) => {
            if (!this.database) {
                reject(new Error("Database not initialized"));
                return;
            }
            const tx = this.database.transaction(this.collectionName, 'readonly');
            const store = tx.objectStore(this.collectionName);
            const results: any[] = [];
            const req = store.openCursor();
            req.onsuccess = (event: any) => {
                const cursor = event.target.result;
                if (cursor) {
                    let match = true;
                    const value = this.fromBuffer(cursor.value);
                    for (const key in query) {
                        if (value[key] !== query[key]) {
                            match = false;
                            break;
                        }
                    }
                    if (match) results.push(value);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            req.onerror = () => reject(req.error);
        });
    }

    public filterMemoryCache(query: Record<string, any>): Promise<any[]> {
        return new Promise((resolve) => {
            const results: any[] = [];
            const keys = Object.keys(query);
            if (keys.includes('id')) {
                const items = this.memoryCache.get(this.generateKey(query.id));
                if (Array.isArray(items)) {
                    results.push(...items);
                } else if (items !== undefined) {
                    results.push(items);
                }
                resolve(results);
            } else {
                for (const [, items] of this.memoryCache.entries()) {
                    const matched = Array.isArray(items)
                        ? items.filter((item: any) =>
                            Object.entries(query).every(([key, value]) => item[key] === value)
                        )
                        : [];
                    results.push(...matched);
                }
                resolve(results);
            }
        });
    }

    public delete(query: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (!this.database) {
                reject(new Error("Database not initialized"));
                return;
            }
            const tx = this.database.transaction(this.collectionName, 'readwrite');
            const store = tx.objectStore(this.collectionName);
            const req = store.delete(query.id);
            req.onsuccess = () => {
                this.memoryCache.delete(this.generateKey(query.id));
                resolve(true);
            };
            req.onerror = () => {
                reject(req.error);
            };
        });
    }

    public getAll(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            if (!this.database) {
                reject(new Error("Database not initialized"));
                return;
            }
            const tx = this.database.transaction(this.collectionName, 'readonly');
            const store = tx.objectStore(this.collectionName);
            const results: any[] = [];
            const req = store.openCursor();
            req.onsuccess = (event: any) => {
                const cursor = event.target.result;
                if (cursor) {
                    results.push(this.fromBuffer(cursor.value));
                    cursor.continue();
                } else {
                    resolve(results); // resolve เมื่อจบ ไม่ return array ทันที
                }
            };
            req.onerror = () => reject(req.error);
        });
    }

    public getAllMemoryCache(): Promise<any[]> {
        return new Promise((resolve) => {
            const results: any[] = [];
            for (const [key, items] of this.memoryCache.entries()) {
                const [databaseName, collectionName, id] = key.split('.')
                if (databaseName === this.databaseName && collectionName === this.collectionName) {
                    results.push({ id, ...items });
                }
            }
            resolve(results);
        });
    }

    public fn(fn: Function): Promise<any[]> {
        return new Promise((resolve, reject) => {
            if (!this.database) {
                reject(new Error("Database not initialized"));
                return;
            }
            const tx = this.database.transaction(this.collectionName, 'readonly');
            const store = tx.objectStore(this.collectionName);
            const results: any[] = [];
            const req = store.openCursor();
            req.onsuccess = (event: any) => {
                const cursor = event.target.result;
                if (cursor) {
                    results.push(this.fromBuffer(cursor.value));
                    cursor.continue();
                } else {
                    resolve(fn(results));
                }
            };
            req.onerror = () => reject(req.error);
        });
    }

    public fnMemoryCache(fn: Function): Promise<any[]> {
        return new Promise((resolve) => {
            const results: any[] = [];
            for (const [key, items] of this.memoryCache.entries()) {
                const [databaseName, collectionName, id] = key.split('.')
                if (databaseName === this.databaseName && collectionName === this.collectionName) {
                    results.push({ id, ...items });
                }
            }
            resolve(fn(results));
        });
    }
}
