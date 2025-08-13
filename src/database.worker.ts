import { IndexedDatabase } from "./IndexedDatabase";

const idb = new IndexedDatabase();
self.onmessage = async (event) => {
    const { action, method, key, data } = event.data;

    switch (action) {
        case "INSERT":
            // Initialize the worker
            if (method === "POST") {
                if (key === 'DATABASE') {
                    if (!data || !data.databaseName) {
                        self.postMessage({
                            action: action,
                            method: "GET",
                            key: 'DATABASE', data: { status: "error", message: "Invalid database name" }
                        });
                    }

                    idb.database(data.databaseName).get().then(() => {
                        self.postMessage({
                            action: action,
                            method: "GET",
                            key: 'DATABASE',
                            data: {
                                status: "success",
                                message: "initialized"
                            }
                        });
                    }).catch((error) => {
                        self.postMessage({
                            action: action,
                            method: "GET",
                            key: 'DATABASE',
                            data: {
                                status: "error",
                                message: error.message
                            }
                        });
                    });
                } else if (key === 'COLLECTION') {
                    if (!data || !data.databaseName) {
                        self.postMessage({
                            action: action,
                            method: "GET",
                            key: 'COLLECTION',
                            data: {
                                status: "error",
                                message: "Invalid database name"
                            }
                        });
                    } else if (!data || !data.collectionName) {
                        self.postMessage({
                            action: action,
                            method: "GET",
                            key: 'COLLECTION',
                            data: {
                                status: "error",
                                message: "Invalid collection name"
                            }
                        });
                    }
                    idb.database(data.databaseName).collection(data.collectionName).insert(data.data).then(() => {
                        self.postMessage({
                            action: action,
                            method: "GET",
                            key: 'COLLECTION',
                            data: {
                                status: "success",
                                message: "initialized"
                            }
                        });
                    }).catch((error) => {
                        self.postMessage({
                            action: action,
                            method: "GET",
                            key: 'COLLECTION',
                            data: {
                                status: "error",
                                message: error.message
                            }
                        });
                    });
                }
            }
            break;
        case "UPDATE":
            if (method === "POST") {
                if (!data || !data.databaseName || !data.collectionName || !data.query || !data.data) {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "error",
                            message: "Invalid parameters for update"
                        }
                    });
                }

                idb.database(data.databaseName).collection(data.collectionName).update(data.query, data.data).then(() => {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "success",
                            message: "updated"
                        }
                    });
                }).catch((error) => {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "error",
                            message: error.message
                        }
                    });
                });
            }
            // Execute the task
            // const result = await executeTask(key, value);
            // self.postMessage({ status: "completed", result });
            break;
        case "DELETE":
            if (method === "POST") {
                if (!data || !data.databaseName || !data.collectionName || !data.query) {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "error",
                            message: "Invalid parameters for delete"
                        }
                    });
                }

                idb.database(data.databaseName).collection(data.collectionName).delete(data.query).then(() => {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "success",
                            message: "deleted"
                        }
                    });
                }).catch((error) => {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "error",
                            message: error.message
                        }
                    });
                });
            }
            break;
        case "FIND":
            if (method === "POST") {
                if (!data || !data.databaseName || !data.collectionName || !data.query) {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "error",
                            message: "Invalid parameters for find"
                        }
                    });
                    return;
                }

                idb.database(data.databaseName).collection(data.collectionName).find(data.query).then((result) => {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "success",
                            message: "found",
                            result
                        }
                    });
                }).catch((error) => {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "error",
                            message: error.message
                        }
                    });
                });
            }
            break;
        case "FIND_MEMORY_CACHE":
            if (method === "POST") {
                if (!data || !data.databaseName || !data.collectionName || !data.query) {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "error",
                            message: "Invalid parameters for find"
                        }
                    });
                    return;
                }

                idb.database(data.databaseName).collection(data.collectionName).findMemoryCache(data.query).then((result) => {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "success",
                            message: "found",
                            result
                        }
                    });
                }).catch((error) => {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "error",
                            message: error.message
                        }
                    });
                });
            }
            break;
        case "FILTER":
            if (method === "POST") {
                if (!data || !data.databaseName || !data.collectionName || !data.query) {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "error",
                            message: "Invalid parameters for filter"
                        }
                    });
                    return;
                }

                idb.database(data.databaseName).collection(data.collectionName).filter(data.query).then((result) => {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "success",
                            message: "filtered",
                            result
                        }
                    });
                }).catch((error) => {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "error",
                            message: error.message
                        }
                    });
                });
            }
            break;
        case "FILTER_MEMORY_CACHE":
            if (method === "POST") {
                if (!data || !data.databaseName || !data.collectionName || !data.query) {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "error",
                            message: "Invalid parameters for filter"
                        }
                    });
                    return;
                }

                idb.database(data.databaseName).collection(data.collectionName).filterMemoryCache(data.query).then((result) => {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "success",
                            message: "filtered",
                            result
                        }
                    });
                }).catch((error) => {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "error",
                            message: error.message
                        }
                    });
                });
            }
            break;
        case "GET_ALL":
            if (method === "POST") {
                if (!data || !data.databaseName || !data.collectionName) {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "error",
                            message: "Invalid parameters for getAll"
                        }
                    });
                    return;
                }

                idb.database(data.databaseName).collection(data.collectionName).getAll().then((result) => {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "success",
                            message: "retrieved all",
                            result
                        }
                    });
                }).catch((error) => {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "error",
                            message: error.message
                        }
                    });
                });
            }
            break;
        case "GET_ALL_MEMORY_CACHE":
            if (method === "POST") {
                if (!data || !data.databaseName || !data.collectionName) {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "error",
                            message: "Invalid parameters for getAll"
                        }
                    });
                    return;
                }

                idb.database(data.databaseName).collection(data.collectionName).getAllMemoryCache().then((result) => {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "success",
                            message: "retrieved all",
                            result
                        }
                    });
                }).catch((error) => {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "error",
                            message: error.message
                        }
                    });
                });
            }
            break;
        case "FUNCTION":
            if (method === "POST") {
                if (!data || !data.databaseName || !data.collectionName || !data.fn) {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "error",
                            message: "Invalid parameters for function"
                        }
                    });
                    return;
                }

                const newFn = new Function(data.fn)

                idb.database(data.databaseName).collection(data.collectionName).fn(newFn).then((result) => {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "success",
                            message: "filtered",
                            result
                        }
                    });
                }).catch((error) => {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "error",
                            message: error.message
                        }
                    });
                });
            }
            break;
        case "FUNCTION_MEMORY_CACHE":
            if (method === "POST") {
                if (!data || !data.databaseName || !data.collectionName || !data.fn) {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "error",
                            message: "Invalid parameters for function"
                        }
                    });
                    return;
                }

                const newFn = new Function(data.fn)

                idb.database(data.databaseName).collection(data.collectionName).fnMemoryCache(newFn).then((result) => {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "success",
                            message: "filtered",
                            result
                        }
                    });
                }).catch((error) => {
                    self.postMessage({
                        action: action,
                        method: "GET",
                        key: 'COLLECTION',
                        data: {
                            status: "error",
                            message: error.message
                        }
                    });
                });
            }
            break;
        default:
            self.postMessage({ status: "error", message: "Unknown action" });
    }
};
