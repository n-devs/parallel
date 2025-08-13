export class Fn {
    private worker: Worker | null = null;
    private fn: Function;
    private key: string;
    constructor(worker: Worker | null,key:string, fn: Function) {
        this.worker = worker;
        this.fn = fn;
        this.key = key;
    }

    public call(...args: any[]): Promise<any> {
        const option: { method: string; fn?: string; args?: any[]; key?: string } = {
            method: "POST",
            args: args,
            fn: this.fn.toString(),
            key: this.key
        };
        this.worker?.postMessage(option);

        return new Promise((resolve, reject) => {


            const handleMessage = (event: MessageEvent) => {
                const { method, data } = event.data;
                if (method === 'GET' && data.key === this.key) {
                    this.worker?.removeEventListener('message', handleMessage);
                    resolve(data.data);
                }
            };

            this.worker?.addEventListener('message', handleMessage);

        });
    }
}
