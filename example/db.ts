import parallel from 'parallel-js';

// const db = parallel.createDatabase('my-database');

const db = parallel.database('my-database');

db.collection('my-table').insert({
  id: 1,
  name: 'John Doe',
  age: 30
});

db.collection('my-table').get().then((data) => {
  console.log(data);
}).catch((error) => {
  console.error('Error fetching data:', error);
});

db.collection('my-table').update({ id: 1 }, { age: 31 }).then(() => {
  console.log('Record updated successfully');
}).catch((error) => {
  console.error('Error updating record:', error);
});

db.collection('my-table').delete({ id: 1 }).then(() => {
  console.log('Record deleted successfully');
}).catch((error) => {
  console.error('Error deleting record:', error);
});

db.collection('my-table').find({id:1}).then((data) => {
  console.log('Final data:', data);
}).catch((error) => {
  console.error('Error fetching final data:', error);
});

db.collection('my-table').filter({id:1}).then((data) => {
  console.log('Final data:', data);
}).catch((error) => {
  console.error('Error fetching final data:', error);
});

db.collection('my-table').fn((e) => {
    return e.id === 1;
}).then((data) => {
  console.log('Final data:', data);
}).catch((error) => {
  console.error('Error fetching final data:', error);
});



export default db;