import parallel from 'parallel-js';

const options = {
    baseUrl: 'https://api.example.com',
    headers: {
        'Authorization': 'Bearer token'
    }
}

const data = {
    id: 1,
    name: 'Jane Doe',
    age: 25
};
const pFetch = parallel.fetch(options);


const pFetchGet = pFetch.get('/cache-endpoint', options);
const pFetchCache = pFetch.cache('/cache-endpoint', options);
const pFetchPost = pFetch.post('/cache-endpoint', data, options);
const pFetchPut = pFetch.put('/cache-endpoint', data, options);
const pFetchPatch = pFetch.patch('/cache-endpoint', data, options);
const pFetchDelete= pFetch.delete('/cache-endpoint', options);

const pFetchGetFn = pFetch.get('/cache-endpoint', options).fn((data) => data);
const pFetchCacheFn = pFetch.cache('/cache-endpoint', options).fn((data) => data);
const pFetchPostFn = pFetch.post('/cache-endpoint', data, options).fn((data) => data);
const pFetchPutFn= pFetch.put('/cache-endpoint', data, options).fn((data) => data);
const pFetchPatchFn = pFetch.patch('/cache-endpoint', data, options).fn((data) => data);
const pFetchDeleteFn= pFetch.delete('/cache-endpoint', options).fn((data) => data);

