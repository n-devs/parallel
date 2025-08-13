self.onmessage = async (event) => {
    const { action, method, url, options } = event.data;

    if (action === 'POST') {
        switch (method) {
            case 'GET':
                fetch(url, options).then(response => response.json()).then(data => {
                    self.postMessage({ action: 'GET', method: 'GET', url, data });
                }).catch(error => {
                    self.postMessage({ action: 'GET', method: 'GET', url, data: { status: 'error', error: error.message } });
                });
                break;
            case 'POST':
                fetch(url, options).then(response => response.json()).then(data => {
                    self.postMessage({ action: 'GET', method: 'POST', url, data });
                }).catch(error => {
                    self.postMessage({ action: 'GET', method: 'POST', url, data: { status: 'error', error: error.message } });
                });
                break;
            case 'PUT':
                fetch(url, options).then(response => response.json()).then(data => {
                    self.postMessage({ action: 'GET', method: 'PUT', url, data });
                }).catch(error => {
                    self.postMessage({ action: 'GET', method: 'PUT', url, data: { status: 'error', error: error.message } });
                });
                break;
            case 'DELETE':
                fetch(url, options).then(response => response.json()).then(data => {
                    self.postMessage({ action: 'GET', method: 'DELETE', url, data });
                }).catch(error => {
                    self.postMessage({ action: 'GET', method: 'DELETE', url, data: { status: 'error', error: error.message } });
                });
                break;
            case 'PATCH':
                fetch(url, options).then(response => response.json()).then(data => {
                    self.postMessage({ action: 'GET', method: 'PATCH', url, data });
                }).catch(error => {
                    self.postMessage({ action: 'GET', method: 'PATCH', url, data: { status: 'error', error: error.message } });
                });
                break;
            default:
                break;
        }
    }
}