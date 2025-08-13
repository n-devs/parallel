export class Store {
    private worker: Worker | null = null;;
    constructor(worker: Worker | null = null) {
        this.worker = worker;
    }

    public get(key: string, fn?: Function) {
        const option: { action: string; method: string; key: string; fn?: string } = {
            action: 'POST',
            method: "GET",
            key: key
        }

        if (fn) {
            option['fn'] = fn.toString();
        }

        this.worker?.postMessage(option);

        const handleMessage = (event: MessageEvent) => {
            const { action, data } = event.data;
            if (
                action === 'GET'
            ) {
                this.worker?.removeEventListener('message', handleMessage);
                return data.data
            }
        };

        this.worker?.addEventListener('message', handleMessage);
    }

    public set(key: string, value: any) {
        this.worker?.postMessage({
            action: 'POST',
            method: "POST",
            key: key,
            data: value
        });
    }
}