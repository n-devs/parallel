import { WorkerDatabase } from "./worker-db";

const workerDatabase = new WorkerDatabase();
self.onmessage = async (event) => {
    const { key, value } = event.data;

    switch (key) {
        case "database":
            // Initialize the worker
            self.postMessage({ status: "initialized" });
            workerDatabase.database(value.database)
            break;
        case "database_collection_insert":
            workerDatabase.database(value.database).collection(value.collection).insert(value.data);
            // Execute the task
            // const result = await executeTask(key, value);
            // self.postMessage({ status: "completed", result });
            break;
        default:
            self.postMessage({ status: "error", message: "Unknown action" });
    }
};

async function executeTask(key, value) {
    // Simulate a task execution
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Task ${key} completed with value: ${value}`);
        }, 1000);
    });
}