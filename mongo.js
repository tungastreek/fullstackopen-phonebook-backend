const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide db password');
  process.exit(1);
}

const dbPassword = process.argv[2];
const url = `mongodb+srv://root:${dbPassword}@toycluster0.u5cfb.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=ToyCluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(url).then(() => console.log('Connected to MongoDB'));

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];
  const person = new Person({ name, number });

  person.save().then((result) => {
    console.log(result);
    mongoose.connection.close().then(() => console.log('Connection closed'));
  });
}

if (process.argv.length === 3) {
  Person.find({}).then((people) => {
    console.log(people);
    mongoose.connection.close().then(() => console.log('Connection closed'));
  });
}
