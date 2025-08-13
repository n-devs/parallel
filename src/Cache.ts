export class Cache {
    private worker: Worker | null = null;
    private name: string;
    constructor(worker: Worker | null = null, name: string) {
        this.worker = worker;
        this.name = name;
    }

    public get(key: string) {
        const option: { action: string; method: string; key: string; name: string } = {
            action: 'POST',
            method: "GET",
            key: key,
            name: this.name

        }

        this.worker?.postMessage(option);

        const handleMessage = (event: MessageEvent) => {
            const { action, data } = event.data;
            if (
                action === 'GET'
                && data.method === 'GET'
                && data.name === this.name
                && key === data.key
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
            name: this.name,
            data: value
        });
    }
}