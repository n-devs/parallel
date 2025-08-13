

self.onmessage = async (event) => {
    const { action, method, name, key, data } = event.data;
    const cache = await caches.open(name);
    if (action === 'POST') {
        if (method === 'POST') {
            const response = await cache.put(key, new Response(JSON.stringify(data)));
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
            const cachedResponse = await cache.match(key);
            if (cachedResponse) {
                const cachedData = await cachedResponse.json();
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