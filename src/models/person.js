const mongoose = require('mongoose');

const mongoDbUri = process.env.MONGODB_URI;
mongoose.set('strictQuery', false);
mongoose
  .connect(mongoDbUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.log('Error connecting to MongoDB:', err.message);
  });

const personSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return /^\d{2,3}-\d{2,3}-\d{4,}$/.test(value);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
});

personSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

const PersonModel = mongoose.model('Person', personSchema);

module.exports = PersonModel;
