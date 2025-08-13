
const memoryCache: Map<string, any> = new Map();
self.onmessage = async (event) => {
    const { action, method, key, data, fn } = event.data;

    if(action === 'POST'){
        if (method === 'POST') {
            memoryCache.set(key, data);
             self.postMessage({
                action: "GET",
                method: "POST",
                key: key,
                data: {
                    status: "success",
                    message: "initialized"
                }
            });
        } else if (method === 'GET') {
            const cachedData = memoryCache.get(key);
            if (cachedData) {
                self.postMessage({
                    action: "GET",
                    method: "GET",
                    key: key,
                    data: {
                        status: "success",
                        message: "found",
                        data: cachedData
                    }
                });
            } else {
                self.postMessage({
                    action: "GET",
                    method: "GET",
                    key: key,
                    data: {
                        status: "error",
                        message: "not found"
                    }
                });
            }
        }
    }

}