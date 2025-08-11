import parallel from 'parallel-js';

// const db = parallel.createDatabase('my-database');

const store = parallel.store('my-store');

store.set({
  id: 1,
  name: 'Jane Doe',
  age: 25
});

const getStore = store.get();
const findStore = store.find({ id: 1 });
const filterStore = store.filter({ id: 1 });
const fnStore = store.fn((data) => {
  return data.filter((item) => item.age > 20);
});