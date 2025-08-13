

self.onmessage = async (event) => {
    const { method, key, args, fn } = event.data;

    if (method === 'POST') {

        const newFn = new Function(fn.toString());
        const newData = newFn(...args)
        self.postMessage({
            method: "GET",
            key: key,
            args: args,
            data: newData
        });

    }
}