import parallel from 'parallel-js';

// const db = parallel.createDatabase('my-database');

const cache = parallel.cache('my-cache');

cache.set({
  id: 1,
  name: 'Jane Doe',
  age: 25
});

const getcache = cache.get();
const fncache = cache.fn((data) => {
  return data
});