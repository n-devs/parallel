export class Fetch {
    private worker: Worker | null = null;
    private _options: RequestInit = {};
    private _headers: HeadersInit = {};
    private _baseUrl: string = ''
    constructor(worker: Worker | null) {
        this.worker = worker;
    }

    set baseUrl(url: string) {
        this._baseUrl = url;
    }

    get baseUrl(): string {
        return this._baseUrl;
    }

    get options(): RequestInit {
        return this._options;
    }

    get headers(): HeadersInit {
        return this._headers;
    }

    set options(options: RequestInit) {
        this._options = options;
    }

    set headers(headers: HeadersInit) {
        this._headers = headers;
    }

    public get(url: string, options?: RequestInit): Promise<Response> {
        this.worker?.postMessage({ action: 'POST', method: 'GET', url: this._baseUrl + url, options: { method: 'GET', ...this._options, ...options, headers: this._headers } });
        return new Promise((resolve, reject) => {
            const handleMessage = (event: MessageEvent) => {
                const { action, method, data } = event.data;
                if (
                    action === 'GET' &&
                    method === 'GET' &&
                    event.data.url === this._baseUrl + url
                ) {
                    this.worker?.removeEventListener('message', handleMessage);
                    if (data.data.status === 'error') {
                        reject(data.data)
                    } else {
                        resolve(data.data);
                    }
                }
            };
            this.worker?.addEventListener('message', handleMessage);
        });
    }

    public post(url: string, body: any, options?: RequestInit): Promise<Response> {
        this.worker?.postMessage({ action: 'POST', method: 'POST', url: this._baseUrl + url, options: { method: 'POST', ...this._options, headers: this._headers, body: JSON.stringify(body) } });
        return new Promise((resolve, reject) => {
            const handleMessage = (event: MessageEvent) => {
                const { action, method, data } = event.data;
                if (
                    action === 'GET' &&
                    method === 'POST' &&
                    event.data.url === this._baseUrl + url
                ) {
                    this.worker?.removeEventListener('message', handleMessage);
                    if (data.data.status === 'error') {
                        reject(data.data)
                    } else {
                        resolve(data.data);
                    }
                }
            };
            this.worker?.addEventListener('message', handleMessage);
        });
    }

    public put(url: string, body: any, options?: RequestInit): Promise<Response> {
        this.worker?.postMessage({ action: 'POST', method: 'PUT', url: this._baseUrl + url, options: { method: 'PUT', ...this._options, ...options, headers: this._headers, body: JSON.stringify(body) } });
        return new Promise((resolve, reject) => {
            const handleMessage = (event: MessageEvent) => {
                const { action, method, data } = event.data;
                if (
                    action === 'GET' &&
                    method === 'PUT' &&
                    event.data.url === this._baseUrl + url
                ) {
                    this.worker?.removeEventListener('message', handleMessage);
                    if (data.data.status === 'error') {
                        reject(data.data)
                    } else {
                        resolve(data.data);
                    }
                }
            };
            this.worker?.addEventListener('message', handleMessage);
        });
    }

    public delete(url: string, options?: RequestInit): Promise<Response> {
        this.worker?.postMessage({ action: 'POST', method: 'DELETE', url: this._baseUrl + url, options: { method: 'DELETE', ...this._options, ...options, headers: this._headers } });
        return new Promise((resolve, reject) => {
            const handleMessage = (event: MessageEvent) => {
                const { action, method, data } = event.data;
                if (
                    action === 'GET' &&
                    method === 'DELETE' &&
                    event.data.url === this._baseUrl + url
                ) {
                    this.worker?.removeEventListener('message', handleMessage);
                    if (data.data.status === 'error') {
                        reject(data.data)
                    } else {
                        resolve(data.data);
                    }
                }
            };
            this.worker?.addEventListener('message', handleMessage);
        });
    }

    public patch(url: string, body: any, options?: RequestInit): Promise<Response> {
        this.worker?.postMessage({ action: 'POST', method: 'PATCH', url: this._baseUrl + url, options: { method: 'PATCH', ...this._options, ...options, headers: this._headers, body: JSON.stringify(body) } });
        return new Promise((resolve, reject) => {
            const handleMessage = (event: MessageEvent) => {
                const { action, method, data } = event.data;
                if (
                    action === 'GET' &&
                    method === 'PATCH' &&
                    event.data.url === this._baseUrl + url
                ) {
                    this.worker?.removeEventListener('message', handleMessage);
                    if (data.data.status === 'error') {
                        reject(data.data)
                    } else {
                        resolve(data.data);
                    }
                }
            };
            this.worker?.addEventListener('message', handleMessage);
        });
    }

}