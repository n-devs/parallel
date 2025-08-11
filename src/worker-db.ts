// worker-db.ts
// IndexedDB helper functions for create, update, find, filter, delete, get
export class WorkerDatabase {
    databaseName: string = '';
    db: IDBDatabase | null = null;
    onerror: any;
    indexedDB: any
    constructor() {
        // Initialization code if needed          
    }

    database(databaseName: string): WorkeDatabaseColection {
        this.databaseName = databaseName;
        this.indexedDB = indexedDB.open(this.databaseName);
        this.onerror = this.indexedDB.error
        this.indexedDB.onerror = () => this.indexedDB.error;
        this.indexedDB.onsuccess = () => {
            this.db = this.indexedDB.result;
        };

        return new WorkeDatabaseColection(this.db);
    }

}

export class WorkeDatabaseColection {
    private database: IDBDatabase | null = null;
    constructor(database: IDBDatabase | null = null) {
        this.database = database;
    }

    collection(collectionName: string) {
        if (!this.database) {
            throw new Error("Database not initialized");
        }
        const transaction = this.database.transaction(collectionName, "readwrite");
        const collection = transaction.objectStore(collectionName);
        return new Colection(this.database, collection, collectionName);
    }



}


class Colection {
    private database: IDBDatabase | null = null;
    private collectionName: string = '';
    private collection: IDBObjectStore | null = null;
    constructor(database: IDBDatabase | null = null, collection: IDBObjectStore | null = null, collectionName: string) {
        this.database = database;
        this.collection = collection;
        this.collectionName = collectionName;
    }


    insert(data: any) {
        if (!this.database) {
            throw new Error("Database not initialized");
        }
        const tx = this.database.transaction(this.collectionName, 'readwrite');
        const store = tx.objectStore(this.collectionName);
        const request = store.add(data);
        request.onsuccess = () => {
            console.log("Data inserted successfully");
        };
        request.onerror = () => {
            console.error("Error inserting data:", request.error);
        };
    }

    update(query: any, data: any) {
        if (!this.database) {
            throw new Error("Database not initialized");
        }
        const tx = this.database.transaction(this.collectionName, 'readwrite');
        const store = tx.objectStore(this.collectionName);
        const getReq = store.get(query.id);
        getReq.onsuccess = () => {
            const record = getReq.result;
            if (record) {
                const updated = { ...record, ...data };
                const putReq = this.collection!.put(updated);
                putReq.onsuccess = () => {
                    console.log("Data updated successfully");
                };
                putReq.onerror = () => {
                    console.error("Error updating data:", putReq.error);

                };
            }
        };
        getReq.onerror = () => {
            console.error("Error finding data:", getReq.error);

        };
    }

    find(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.database) {
                reject(new Error("Database not initialized"));
                return;
            }
            const tx = this.database.transaction(this.collectionName, 'readonly');
            const store = tx.objectStore(this.collectionName);
            const request = store.get(query.id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    filter(query: any): any[] {

        if (!this.database) {
            throw new Error("Database not initialized");
        }
        const tx = this.database.transaction(this.collectionName, 'readonly');
        const store = tx.objectStore(this.collectionName);
        const results: any[] = [];
        const req = store.openCursor();
        req.onsuccess = (event: any) => {
            const cursor = event.target.result;
            if (cursor) {
                let match = true;
                for (const key in query) {
                    if (cursor.value[key] !== query[key]) {
                        match = false;
                        break;
                    }
                }
                if (match) results.push(cursor.value);
                cursor.continue();
            } else {
                return results
            }
        };
        req.onerror = () => req.error;

        return results

    }

    delete(query: any) {
        if (!this.database) {
            throw new Error("Database not initialized");
        }

        const tx = this.database.transaction(this.collectionName, 'readwrite');
        const store = tx.objectStore(this.collectionName);
        const req = store.delete(query.id);
        req.onsuccess = () => true;
        req.onerror = () => req.error;
    }

    getAll() {
        if (!this.database) {
            throw new Error("Database not initialized");
        }
        const tx = this.database.transaction(this.collectionName, 'readonly');
        const store = tx.objectStore(this.collectionName);
        const results: any[] = [];
        const req = store.openCursor();
        req.onsuccess = (event: any) => {
            const cursor = event.target.result;
            if (cursor) {
                results.push(cursor.value);
                cursor.continue();
            } else {
                return results;
            }
        };
        req.onerror = () => req.error;
        return results;
    }
}
